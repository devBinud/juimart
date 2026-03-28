import React, { useEffect, useState, useRef, useMemo } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { listenOrders, updateOrder as fbUpdateOrder } from '../../firebase/orderService';
import NewOrderAlert from '../../components/admin/NewOrderAlert';
import { AdminPage, PageHeader, StatCard, Card, SectionTitle, StatusBadge } from './AdminLayout';
import './admin.css';

const ORDER_STEPS = [
  { key: 'placed',    label: 'Placed',    icon: '📋' },
  { key: 'verified',  label: 'Verified',  icon: '✅' },
  { key: 'confirmed', label: 'Confirmed', icon: '📦' },
  { key: 'shipped',   label: 'Shipped',   icon: '🚚' },
  { key: 'done',      label: 'Delivered', icon: '🎉' },
];
const COD_STEPS = [
  { key: 'placed',    label: 'Placed',    icon: '📋' },
  { key: 'confirmed', label: 'Confirmed', icon: '📦' },
  { key: 'shipped',   label: 'Shipped',   icon: '🚚' },
  { key: 'done',      label: 'Delivered', icon: '🎉' },
];

const getActiveStep = (o) => {
  if (o.orderStatus === 'delivered') return 'done';
  if (o.orderStatus === 'confirmed' && o.paymentStatus === 'verified') return 'shipped';
  if (o.paymentStatus === 'verified') return 'confirmed';
  if (o.paymentStatus === 'pending_verification') return 'verified';
  return 'placed';
};
const getCodStep = (o) => {
  if (o.orderStatus === 'delivered') return 'done';
  if (o.orderStatus === 'shipped') return 'shipped';
  if (o.orderStatus === 'confirmed') return 'confirmed';
  return 'placed';
};

const StepTracker = ({ steps, activeKey }) => {
  const activeIdx = steps.findIndex(s => s.key === activeKey);
  return (
    <div className="step-tracker">
      {steps.map((step, i) => {
        const done = i < activeIdx, current = i === activeIdx;
        return (
          <React.Fragment key={step.key}>
            <div className="step-node">
              <div className={`step-circle ${done ? 'done' : current ? 'current' : 'pending'}`}>
                {done ? '✓' : step.icon}
              </div>
              <span className="step-label" style={{ color: done || current ? '#15803d' : '#94a3b8' }}>{step.label}</span>
            </div>
            {i < steps.length - 1 && <div className="step-line" style={{ background: done ? '#22c55e' : '#e2e8f0' }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [allOrders, setAllOrders] = useState([]);
  const [timers, setTimers] = useState({});
  const [newOrderIds, setNewOrderIds] = useState(new Set());
  const [alertOrders, setAlertOrders] = useState([]);
  const [screenshotModal, setScreenshotModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const prevIdsRef = useRef(new Set());
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    const db = getDatabase();
    onValue(ref(db, 'products'), (snap) => {
      const data = snap.val();
      if (!data) return;
      const list = Object.values(data);
      setTotalProducts(list.length);
      setTotalCategories(new Set(list.map(p => p.category).filter(Boolean)).size);
    });
  }, []);

  useEffect(() => {
    const unsub = listenOrders((orders) => {
      const currentIds = new Set(orders.map(o => o.firebaseKey));
      const brandNew = [...currentIds].filter(id => !prevIdsRef.current.has(id));

      const pending = orders.filter(o => o.paymentStatus === 'pending_verification');

      if (!isFirstLoadRef.current) {
        // New orders arrived — show alert
        if (brandNew.length > 0) {
          setAlertOrders(orders.filter(o => brandNew.includes(o.firebaseKey)));
          setNewOrderIds(prev => new Set([...prev, ...brandNew]));
          setTimers(prev => ({ ...prev, ...Object.fromEntries(brandNew.map(id => [id, 60])) }));
        }
      } else {
        // First load — if there are pending payments, show alert immediately
        if (pending.length > 0) {
          setAlertOrders([]); // no "new" orders, but pending will show via pendingPay prop
        }
      }

      prevIdsRef.current = currentIds;
      isFirstLoadRef.current = false;
      setAllOrders(orders);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setTimers(prev => {
        const u = { ...prev };
        Object.keys(u).forEach(id => { if (u[id] > 0) u[id]--; });
        return u;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const updateOrder = (key, patch) => {
    fbUpdateOrder(key, patch);
    setTimers(prev => { const t = { ...prev }; delete t[key]; return t; });
    setNewOrderIds(prev => { const n = new Set(prev); n.delete(key); return n; });
  };

  // Derived stats
  const today = new Date().toLocaleDateString('en-IN');
  const todayOrders = useMemo(() => allOrders.filter(o => o.date?.includes(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })) || o.date?.startsWith(today.split('/').reverse().join('/'))), [allOrders, today]);
  const pendingOrders = useMemo(() => allOrders.filter(o => o.paymentStatus === 'pending_verification'), [allOrders]);
  const codOrders = useMemo(() => allOrders.filter(o => o.paymentMethod === 'cod' && o.orderStatus !== 'cancelled' && o.orderStatus !== 'delivered'), [allOrders]);
  const totalRevenue = useMemo(() => allOrders.filter(o => o.orderStatus !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0), [allOrders]);
  const todayRevenue = useMemo(() => todayOrders.filter(o => o.orderStatus !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0), [todayOrders]);

  const tc = (s) => s > 30 ? '#22c55e' : s > 10 ? '#f59e0b' : '#ef4444';

  const stats = [
    { icon: '🧾', label: 'Total Orders',    value: allOrders.length,     sub: `${todayOrders.length} today`,         color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: '💰', label: 'Total Revenue',   value: `₹${totalRevenue}`,   sub: `₹${todayRevenue} today`,              color: '#22c55e', bg: '#f0fdf4' },
    { icon: '⏳', label: 'Pending',         value: pendingOrders.length, sub: 'awaiting verification',               color: '#f59e0b', bg: '#fffbeb' },
    { icon: '📦', label: 'Products',        value: totalProducts,        sub: `${totalCategories} categories`,       color: '#3b82f6', bg: '#eff6ff' },
  ];

  return (
    <AdminPage>
      <NewOrderAlert
        orders={alertOrders}
        pendingPay={pendingOrders}
        onDismiss={() => setAlertOrders([])}
        onVerify={(key, patch) => updateOrder(key, patch)}
      />

      {screenshotModal && (
        <div className="admin-modal-overlay" onClick={() => setScreenshotModal(null)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Payment Screenshot</span>
              <button className="admin-close-btn" onClick={() => setScreenshotModal(null)}>✕</button>
            </div>
            <img src={screenshotModal} alt="proof" style={{ width: '100%', borderRadius: 12, maxHeight: '70vh', objectFit: 'contain' }} />
          </div>
        </div>
      )}

      <PageHeader title="Dashboard" subtitle={`Welcome back, Admin 👋 · ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}`}
        action={pendingOrders.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#92400e', padding: '8px 16px', borderRadius: 50, fontSize: 13, fontWeight: 700, animation: 'pulse 2s infinite' }}>
            🔔 {pendingOrders.length} pending payment{pendingOrders.length > 1 ? 's' : ''}
          </div>
        )}
      />

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14, marginBottom: 24 }}>
        {loading
          ? [...Array(4)].map((_, i) => <div key={i} className="skeleton-stat"><div className="skeleton" style={{ width: 46, height: 46, borderRadius: 12 }} /><div style={{ flex: 1 }}><div className="skeleton" style={{ height: 10, width: '60%', marginBottom: 10 }} /><div className="skeleton" style={{ height: 22, width: '40%' }} /></div></div>)
          : stats.map(s => <StatCard key={s.label} {...s} />)
        }
      </div>

      {/* TODAY'S ORDERS — quick table */}
      <Card style={{ marginBottom: 20 }}>
        <SectionTitle action={<a href="/admin/all-orders" style={{ fontSize: 12, color: '#22c55e', fontWeight: 700, textDecoration: 'none' }}>View all →</a>}>
          📅 Today's Orders
          {todayOrders.length > 0 && <span style={{ marginLeft: 8, background: '#22c55e', color: '#fff', borderRadius: 50, fontSize: 11, fontWeight: 800, padding: '2px 8px' }}>{todayOrders.length}</span>}
        </SectionTitle>
        {loading ? (
          <div className="skeleton" style={{ height: 80, borderRadius: 10 }} />
        ) : todayOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: '#94a3b8', fontSize: 13 }}>
            <p style={{ fontSize: 36, marginBottom: 8 }}>📅</p>
            <p style={{ fontWeight: 600, color: '#64748b' }}>No orders today yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todayOrders.slice(0, 5).map((o, i) => (
                  <tr key={o.firebaseKey} style={{ borderBottom: '1px solid #f8fafc', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>{o.id?.slice(-8)}</td>
                    <td style={{ padding: '10px 12px', color: '#374151' }}>{o.customer?.name}</td>
                    <td style={{ padding: '10px 12px', color: '#64748b' }}>{o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#22c55e' }}>₹{o.total}</td>
                    <td style={{ padding: '10px 12px' }}><StatusBadge status={o.paymentMethod === 'cod' ? 'cod' : o.paymentStatus} /></td>
                    <td style={{ padding: '10px 12px' }}><StatusBadge status={o.orderStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* PENDING PAYMENTS */}
      <Card style={{ marginBottom: 20 }}>
        <SectionTitle>
          🔔 Pending Payment Verifications
          {pendingOrders.length > 0 && <span style={{ marginLeft: 8, background: '#ef4444', color: '#fff', borderRadius: 50, fontSize: 11, fontWeight: 800, padding: '2px 8px' }}>{pendingOrders.length}</span>}
        </SectionTitle>
        {loading ? (
          <div className="skeleton" style={{ height: 100, borderRadius: 10 }} />
        ) : pendingOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0' }}>
            <p style={{ fontSize: 36, marginBottom: 8 }}>✅</p>
            <p style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>No pending payments right now.</p>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>All online payments are verified.</p>
          </div>
        ) : pendingOrders.map(order => {
          const secs = timers[order.firebaseKey] ?? 60;
          const isNew = newOrderIds.has(order.firebaseKey);
          return (
            <div key={order.firebaseKey} className={`admin-order-card ${isNew ? 'new-order' : ''}`} style={{ marginBottom: 14 }}>
              {isNew && <div className="admin-new-badge">✨ New Order</div>}
              <div className="admin-order-top">
                <div style={{ flex: 1 }}>
                  <div className="admin-order-meta">
                    <span className="admin-order-id">{order.id}</span>
                    <span className="admin-order-date">{order.date}</span>
                    <StatusBadge status={order.paymentStatus} />
                  </div>
                  <div className="admin-info-grid">
                    {[['Customer', order.customer?.name], ['Phone', order.customer?.phone], ['Address', order.customer?.address], ['Items', order.items?.map(i => `${i.name} ×${i.quantity}`).join(', ')]].map(([label, value]) => (
                      <div key={label} className="admin-info-row">
                        <span className="admin-info-label">{label}</span>
                        <span className="admin-info-value">{value}</span>
                      </div>
                    ))}
                    <div className="admin-info-row">
                      <span className="admin-info-label">Total</span>
                      <span className="admin-info-value" style={{ color: '#22c55e', fontWeight: 700, fontSize: 16 }}>₹{order.total}</span>
                    </div>
                  </div>
                  <StepTracker steps={ORDER_STEPS} activeKey={getActiveStep(order)} />
                </div>
                {order.paymentProof && (
                  <div className="admin-proof-box">
                    <p className="admin-proof-label">Screenshot</p>
                    <img src={order.paymentProof} alt="proof" className="admin-proof-img" />
                    <button className="admin-view-btn" onClick={() => setScreenshotModal(order.paymentProof)}>🔍 View Full</button>
                  </div>
                )}
              </div>
              <div className="admin-timer-section">
                <div className="admin-timer-row">
                  <span className="admin-timer-label">{secs > 0 ? 'Time to verify' : '⚠️ Expired'}</span>
                  <span className="admin-timer-count" style={{ color: tc(secs) }}>{secs}s</span>
                </div>
                <div className="admin-timer-track"><div className="admin-timer-fill" style={{ width: `${(secs / 60) * 100}%`, background: tc(secs) }} /></div>
              </div>
              <div className="admin-actions">
                <button className="admin-btn admin-btn-green" onClick={() => updateOrder(order.firebaseKey, { paymentStatus: 'verified', orderStatus: 'confirmed' })}>✅ Verify Payment</button>
                <button className="admin-btn admin-btn-red" onClick={() => updateOrder(order.firebaseKey, { paymentStatus: 'rejected', orderStatus: 'cancelled' })}>❌ Reject</button>
              </div>
            </div>
          );
        })}
      </Card>

      {/* COD ORDERS */}
      <Card>
        <SectionTitle>
          💵 Active COD Orders
          {codOrders.length > 0 && <span style={{ marginLeft: 8, background: '#3b82f6', color: '#fff', borderRadius: 50, fontSize: 11, fontWeight: 800, padding: '2px 8px' }}>{codOrders.length}</span>}
        </SectionTitle>
        {loading ? (
          <div className="skeleton" style={{ height: 80, borderRadius: 10 }} />
        ) : codOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: '#94a3b8', fontSize: 13 }}>
            <p style={{ fontSize: 36, marginBottom: 8 }}>💵</p>
            <p style={{ fontWeight: 600, color: '#64748b' }}>No active COD orders.</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>COD orders will appear here once placed.</p>
          </div>
        ) : codOrders.map(order => (
          <div key={order.firebaseKey} className="admin-order-card" style={{ marginBottom: 14 }}>
            <div className="admin-order-meta">
              <span className="admin-order-id">{order.id}</span>
              <span className="admin-order-date">{order.date}</span>
              <StatusBadge status="cod" />
            </div>
            <div className="admin-info-grid">
              {[['Customer', order.customer?.name], ['Phone', order.customer?.phone], ['Address', order.customer?.address], ['Items', order.items?.map(i => `${i.name} ×${i.quantity}`).join(', ')]].map(([label, value]) => (
                <div key={label} className="admin-info-row">
                  <span className="admin-info-label">{label}</span>
                  <span className="admin-info-value">{value}</span>
                </div>
              ))}
              <div className="admin-info-row">
                <span className="admin-info-label">Total</span>
                <span className="admin-info-value" style={{ color: '#3b82f6', fontWeight: 700, fontSize: 16 }}>₹{order.total}</span>
              </div>
            </div>
            <StepTracker steps={COD_STEPS} activeKey={getCodStep(order)} />
            <div className="admin-actions" style={{ marginTop: 14 }}>
              {/* Confirm — only if not yet confirmed */}
              {(order.orderStatus === 'placed' || order.orderStatus === 'pending' || !order.orderStatus) && (
                <button className="admin-btn admin-btn-blue" onClick={() => fbUpdateOrder(order.firebaseKey, { orderStatus: 'confirmed' })}>📦 Confirm Order</button>
              )}
              {/* Ship — only if confirmed */}
              {order.orderStatus === 'confirmed' && (
                <button className="admin-btn admin-btn-purple" onClick={() => fbUpdateOrder(order.firebaseKey, { orderStatus: 'shipped' })}>🚚 Mark Shipped</button>
              )}
              {/* Deliver — if confirmed or shipped */}
              {(order.orderStatus === 'confirmed' || order.orderStatus === 'shipped') && (
                <button className="admin-btn admin-btn-green" onClick={() => fbUpdateOrder(order.firebaseKey, { orderStatus: 'delivered' })}>🎉 Mark Delivered</button>
              )}
              {/* Cancel — only if not delivered */}
              {order.orderStatus !== 'delivered' && (
                <button className="admin-btn admin-btn-red" onClick={() => fbUpdateOrder(order.firebaseKey, { orderStatus: 'cancelled' })}>❌ Cancel</button>
              )}
            </div>
          </div>
        ))}
      </Card>
    </AdminPage>
  );
};

export default Dashboard;
