import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { FiGrid, FiLogOut, FiPackage, FiPlusCircle, FiShoppingBag, FiBarChart2, FiMenu, FiX } from 'react-icons/fi';

const NAV = [
  { label: 'Dashboard',   href: '/admin/dashboard',    icon: <FiGrid size={16} /> },
  { label: 'Add Product', href: '/admin/add-product',  icon: <FiPlusCircle size={16} /> },
  { label: 'Products',    href: '/admin/all-products', icon: <FiPackage size={16} /> },
  { label: 'All Orders',  href: '/admin/all-orders',   icon: <FiShoppingBag size={16} /> },
  { label: 'Analytics',   href: '/admin/analytics',    icon: <FiBarChart2 size={16} /> },
];

const SidebarContent = ({ onClose }) => {
  const navigate = useNavigate();
  const path = window.location.pathname;

  const logout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminExpiry');
    navigate('/admin/login');
  };

  return (
    <>
      {/* Logo + close on mobile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 32 }}>
        <img src={logo} alt="Zui Quick Mart" style={{ height: 36, borderRadius: 8 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', margin: 0 }}>Zui Quick Mart</p>
          <p style={{ fontSize: 10, color: '#22c55e', margin: 0, fontWeight: 600 }}>Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
            <FiX size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(item => {
          const active = path === item.href;
          return (
            <a key={item.href} href={item.href}
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10,
                textDecoration: 'none', fontSize: 13, fontWeight: active ? 700 : 500,
                color: active ? '#fff' : '#94a3b8',
                background: active ? 'rgba(34,197,94,0.18)' : 'transparent',
                borderLeft: active ? '3px solid #22c55e' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ color: active ? '#22c55e' : '#64748b', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <button onClick={logout} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 12px', borderRadius: 10,
        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
        color: '#f87171', fontSize: 13, fontWeight: 600,
        cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
        transition: 'all 0.2s', width: '100%', marginTop: 8,
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
      >
        <FiLogOut size={14} /> Logout
      </button>
    </>
  );
};

export const AdminPage = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarStyle = {
    width: 220, flexShrink: 0,
    background: 'linear-gradient(180deg,#0f172a 0%,#1a2744 100%)',
    display: 'flex', flexDirection: 'column',
    padding: '24px 12px 20px',
    fontFamily: "'Outfit', sans-serif",
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @keyframes sidebarIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @media(min-width:768px) {
          .admin-hamburger { display: none !important; }
          .admin-sidebar-desktop { display: flex !important; position: sticky; top: 0; height: 100vh; }
        }
        @media(max-width:767px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-main-content { padding: 16px 14px 32px !important; }
        }
      `}</style>

      {/* Desktop sidebar */}
      <aside className="admin-sidebar-desktop" style={{ ...sidebarStyle, display: 'flex' }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay drawer */}
      {sidebarOpen && (
        <>
          <div onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 9998, backdropFilter: 'blur(2px)' }} />
          <aside style={{ ...sidebarStyle, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 9999, animation: 'sidebarIn 0.25s ease', boxShadow: '8px 0 32px rgba(0,0,0,0.3)' }}>
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile topbar with hamburger */}
        <div className="admin-hamburger" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: '#0f172a',
          position: 'sticky', top: 0, zIndex: 100,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setSidebarOpen(true)}
              style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: '#e2e8f0', display: 'flex' }}>
              <FiMenu size={18} />
            </button>
            <img src={logo} alt="Zui Quick Mart" style={{ height: 28, borderRadius: 6 }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Zui Quick Mart Admin</span>
          </div>
          <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, background: 'rgba(34,197,94,0.15)', padding: '3px 10px', borderRadius: 50 }}>
            {window.location.pathname.split('/').pop().replace('-', ' ')}
          </span>
        </div>

        <main className="admin-main-content" style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 40px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.4px' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13, color: '#64748b', margin: '3px 0 0' }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const StatCard = ({ icon, label, value, sub, color = '#22c55e', bg = '#f0fdf4' }) => (
  <div style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
    <div style={{ width: 46, height: 46, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{icon}</div>
    <div style={{ minWidth: 0 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 3px' }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0' }}>{sub}</p>}
    </div>
  </div>
);

export const Card = ({ children, style = {} }) => (
  <div style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', ...style }}>
    {children}
  </div>
);

export const SectionTitle = ({ children, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
    <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>{children}</h2>
    {action}
  </div>
);

export const StatusBadge = ({ status }) => {
  const map = {
    cod:                  { bg: '#eff6ff', color: '#1d4ed8', label: '💵 COD' },
    verified:             { bg: '#f0fdf4', color: '#15803d', label: '✅ Verified' },
    rejected:             { bg: '#fef2f2', color: '#dc2626', label: '❌ Rejected' },
    pending_verification: { bg: '#fffbeb', color: '#92400e', label: '⏳ Pending' },
    confirmed:            { bg: '#f0fdf4', color: '#15803d', label: '📦 Confirmed' },
    delivered:            { bg: '#ecfdf5', color: '#065f46', label: '🚚 Delivered' },
    cancelled:            { bg: '#fef2f2', color: '#dc2626', label: '🚫 Cancelled' },
    placed:               { bg: '#f8fafc', color: '#64748b', label: '📋 Placed' },
  };
  const st = map[status] || { bg: '#f1f5f9', color: '#64748b', label: status };
  return (
    <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 50, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {st.label}
    </span>
  );
};
