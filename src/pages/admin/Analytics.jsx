import React, { useEffect, useState, useMemo } from 'react';
import { listenVisits } from '../../firebase/analyticsService';
import { AdminPage, PageHeader } from './AdminLayout';
import './admin.css';

/* ── Bar chart row ── */
const Bar = ({ label, value, max, color }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
    </div>
    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${max ? (value / max) * 100 : 0}%`, background: color, borderRadius: 10, transition: 'width 0.6s ease' }} />
    </div>
  </div>
);

/* ── Stat mini card ── */
const MiniStat = ({ icon, label, value, color, bg }) => (
  <div style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
    <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1 }}>{value}</p>
    </div>
  </div>
);

const Analytics = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const unsub = listenVisits((data) => {
      setVisits(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* ── Derived stats ── */
  const stats = useMemo(() => {
    const total = visits.length;

    // Today
    const today = new Date().toLocaleDateString('en-IN');
    const todayCount = visits.filter(v => v.date === today).length;

    // Unique sessions (by hour+date rough estimate)
    const uniqueDays = new Set(visits.map(v => v.date)).size;

    // Device breakdown
    const devices = {};
    visits.forEach(v => { devices[v.deviceType] = (devices[v.deviceType] || 0) + 1; });

    // OS breakdown
    const os = {};
    visits.forEach(v => { os[v.os] = (os[v.os] || 0) + 1; });

    // Browser breakdown
    const browsers = {};
    visits.forEach(v => { browsers[v.browser] = (browsers[v.browser] || 0) + 1; });

    // Pages
    const pages = {};
    visits.forEach(v => { pages[v.page] = (pages[v.page] || 0) + 1; });

    // By date (last 7 days)
    const byDate = {};
    visits.forEach(v => { byDate[v.date] = (byDate[v.date] || 0) + 1; });
    const last7 = Object.entries(byDate)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .slice(0, 7)
      .reverse();

    // By hour
    const byHour = Array(24).fill(0);
    visits.forEach(v => { if (v.hour !== undefined) byHour[v.hour]++; });

    // Languages
    const langs = {};
    visits.forEach(v => { langs[v.language] = (langs[v.language] || 0) + 1; });

    return { total, todayCount, uniqueDays, devices, os, browsers, pages, last7, byHour, langs };
  }, [visits]);

  const sortedEntries = (obj) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1]);

  const maxVal = (obj) => Math.max(...Object.values(obj), 1);

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  return (
    <AdminPage>
      <PageHeader title="📈 Analytics" subtitle="Visitor insights from last 500 sessions" />

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-stat">
                <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 14 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 10, width: '60%', marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 24, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Mini stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
              <MiniStat icon="👁️" label="Total Visits"   value={stats.total}      color="#22c55e" bg="#f0fdf4" />
              <MiniStat icon="📅" label="Today"          value={stats.todayCount} color="#3b82f6" bg="#eff6ff" />
              <MiniStat icon="📆" label="Active Days"    value={stats.uniqueDays} color="#8b5cf6" bg="#f5f3ff" />
              <MiniStat icon="📱" label="Mobile Visits"  value={stats.devices['Mobile'] || 0} color="#f59e0b" bg="#fffbeb" />
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {['overview', 'devices', 'pages', 'time'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ padding: '8px 18px', borderRadius: 50, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'all 0.2s', background: tab === t ? '#22c55e' : '#f1f5f9', color: tab === t ? '#fff' : '#64748b', boxShadow: tab === t ? '0 4px 12px rgba(34,197,94,0.3)' : 'none' }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* OVERVIEW TAB */}
            {tab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>

                {/* OS */}
                <div style={{ background: '#fff', borderRadius: 18, padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>🖥️ Operating System</h3>
                  {sortedEntries(stats.os).map(([name, count], i) => (
                    <Bar key={name} label={name} value={count} max={maxVal(stats.os)} color={COLORS[i % COLORS.length]} />
                  ))}
                </div>

                {/* Browser */}
                <div style={{ background: '#fff', borderRadius: 18, padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>🌐 Browser</h3>
                  {sortedEntries(stats.browsers).map(([name, count], i) => (
                    <Bar key={name} label={name} value={count} max={maxVal(stats.browsers)} color={COLORS[i % COLORS.length]} />
                  ))}
                </div>

                {/* Language */}
                <div style={{ background: '#fff', borderRadius: 18, padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>🌍 Language</h3>
                  {sortedEntries(stats.langs).slice(0, 6).map(([name, count], i) => (
                    <Bar key={name} label={name} value={count} max={maxVal(stats.langs)} color={COLORS[i % COLORS.length]} />
                  ))}
                </div>
              </div>
            )}

            {/* DEVICES TAB */}
            {tab === 'devices' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
                <div style={{ background: '#fff', borderRadius: 18, padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>📱 Device Type</h3>
                  {sortedEntries(stats.devices).map(([name, count], i) => (
                    <Bar key={name} label={name} value={count} max={maxVal(stats.devices)} color={COLORS[i % COLORS.length]} />
                  ))}
                </div>
                <div style={{ background: '#fff', borderRadius: 18, padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>🖥️ OS Breakdown</h3>
                  {sortedEntries(stats.os).map(([name, count], i) => (
                    <Bar key={name} label={name} value={count} max={maxVal(stats.os)} color={COLORS[i % COLORS.length]} />
                  ))}
                </div>
              </div>
            )}

            {/* PAGES TAB */}
            {tab === 'pages' && (
              <div style={{ background: '#fff', borderRadius: 18, padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', maxWidth: 600 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>📄 Most Visited Pages</h3>
                {sortedEntries(stats.pages).slice(0, 10).map(([page, count], i) => (
                  <Bar key={page} label={page || '/'} value={count} max={maxVal(stats.pages)} color={COLORS[i % COLORS.length]} />
                ))}
              </div>
            )}

            {/* TIME TAB */}
            {tab === 'time' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>

                {/* Last 7 days */}
                <div style={{ background: '#fff', borderRadius: 18, padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>📅 Last 7 Days</h3>
                  {stats.last7.length === 0
                    ? <p style={{ color: '#94a3b8', fontSize: 13 }}>Not enough data yet.</p>
                    : stats.last7.map(([date, count]) => (
                      <Bar key={date} label={date} value={count} max={Math.max(...stats.last7.map(d => d[1]), 1)} color="#22c55e" />
                    ))
                  }
                </div>

                {/* By hour */}
                <div style={{ background: '#fff', borderRadius: 18, padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>🕐 Visits by Hour</h3>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 80 }}>
                    {stats.byHour.map((count, h) => {
                      const maxH = Math.max(...stats.byHour, 1);
                      const pct = (count / maxH) * 100;
                      return (
                        <div key={h} title={`${h}:00 — ${count} visits`}
                          style={{ flex: 1, background: pct > 0 ? '#22c55e' : '#f1f5f9', borderRadius: '3px 3px 0 0', height: `${Math.max(pct, 4)}%`, transition: 'height 0.4s ease', cursor: 'default', opacity: pct > 0 ? 1 : 0.4 }} />
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>12am</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>6am</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>12pm</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>6pm</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>11pm</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent visits table */}
            <div style={{ background: '#fff', borderRadius: 18, padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginTop: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>🕒 Recent Visits</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                      {['Page', 'Device', 'OS', 'Browser', 'Language', 'Date'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visits.slice(0, 20).map((v, i) => (
                      <tr key={v.id} style={{ borderBottom: '1px solid #f8fafc', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '9px 12px', color: '#0f172a', fontWeight: 600 }}>{v.page || '/'}</td>
                        <td style={{ padding: '9px 12px', color: '#374151' }}>
                          <span style={{ background: v.deviceType === 'Mobile' ? '#eff6ff' : v.deviceType === 'Tablet' ? '#f5f3ff' : '#f0fdf4', color: v.deviceType === 'Mobile' ? '#1d4ed8' : v.deviceType === 'Tablet' ? '#7c3aed' : '#15803d', padding: '2px 8px', borderRadius: 50, fontSize: 11, fontWeight: 700 }}>
                            {v.deviceType === 'Mobile' ? '📱' : v.deviceType === 'Tablet' ? '📟' : '🖥️'} {v.deviceType}
                          </span>
                        </td>
                        <td style={{ padding: '9px 12px', color: '#374151' }}>{v.os}</td>
                        <td style={{ padding: '9px 12px', color: '#374151' }}>{v.browser}</td>
                        <td style={{ padding: '9px 12px', color: '#64748b' }}>{v.language}</td>
                        <td style={{ padding: '9px 12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{v.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
    </AdminPage>
  );
};

export default Analytics;
