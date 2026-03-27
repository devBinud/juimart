import React, { useEffect, useState } from 'react';
import { listenOrders } from '../../firebase/orderService';
import './admin.css';

const injectStyles = () => {
  if (document.getElementById('allorders-style')) return;
  const style = document.createElement('style');
  style.id = 'allorders-style';
  style.innerHTML = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
};

const FILTERS = ['All', 'COD', 'Online', 'Pending', 'Verified', 'Rejected', 'Delivered', 'Cancelled'];

const statusBadge = (status) => {
  const map = {
    cod:                  { bg: '#eff6ff', color: '#1d4ed8',  label: '💵 COD' },
    verified:             { bg: '#f0fdf4', color: '#15803d',  label: '✅ Verified' },
    rejected:             { bg: '#fef2f2', color: '#dc2626',  label: '❌ Rejected' },
    pending_verification: { bg: '#fffbeb', color: '#92400e',  label: '⏳ Pending' },
    confirmed:            { bg: '#f0fdf4', color: '#15803d',  label: '📦 Confirmed' },
    delivered:            { bg: '#ecfdf5', color: '#065f46',  label: '🚚 Delivered' },
    cancelled:            { bg: '#fef2f2', color: '#dc2626',  label: '🚫 Cancelled' },
  };
  const st = map[status] || { bg: '#f1f5f9', color: '#64748b', label: status };
  return (
    <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: 700 }}>
      {st.label}
    </span>
  );
};

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    injectStyles();
    const unsub = listenOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.phone?.includes(search);

    const matchFilter = (() => {
      if (filter === 'All') return true;
      if (filter === 'COD') return o.paymentMethod === 'cod';
      if (filter === 'Online') return o.paymentMethod === 'online';
      if (filter === 'Pending') return o.paymentStatus === 'pending_verification';
      if (filter === 'Verified') return o.paymentStatus === 'verified';
      if (filter === 'Rejected') return o.paymentStatus === 'rejected';
      if (filter === 'Delivered') return o.orderStatus === 'delivered';
      if (filter === 'Cancelled') return o.orderStatus === 'cancelled';
      return true;
    })();

    return matchSearch && matchFilter;
  });

  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">🌿 Juimart</div>
        <nav className="admin-nav">
          {[
            { label: '📊 Dashboard',      href: '/admin/dashboard' },
            { label: '➕ Add Product',     href: '/admin/add-product' },
            { label: '📦 Manage Products', href: '/admin/all-products' },
            { label: '🧾 All Orders',      href: '/admin/all-orders' },
            { label: '📈 Analytics',       href: '/admin/analytics' },
          ].map((item) => (
            <a key={item.href} href={item.href}
              className={`admin-nav-link ${window.location.pathname === item.href ? 'active' : ''}`}>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <div style={s.topBar}>
          <div>
            <h1 style={s.heading}>All Orders</h1>
            <p style={s.subheading}>{orders.length} total orders · ₹{totalRevenue} revenue</p>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div style={s.toolbar}>
          <input
            placeholder="🔍 Search by name, phone or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={s.searchInput}
          />
          <div style={s.filterRow}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  ...s.filterBtn,
                  background: filter === f ? '#22c55e' : '#f1f5f9',
                  color: filter === f ? '#fff' : '#374151',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS COUNT */}
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
          Showing {filtered.length} order{filtered.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 18, marginBottom: 12, padding: '18px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div className="skeleton" style={{ height: 14, width: 140, borderRadius: 6 }} />
                    <div className="skeleton" style={{ height: 14, width: 90, borderRadius: 6 }} />
                    <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 50 }} />
                  </div>
                  <div className="skeleton" style={{ height: 16, width: 50, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </>
        ) : filtered.length === 0 ? (
          <div style={s.emptyBox}>
            <p style={{ fontSize: '28px', marginBottom: '8px' }}>📭</p>
            <p style={{ color: '#6b7280', fontWeight: 500 }}>No orders found.</p>
          </div>
        ) : (
          filtered.map((order) => (
            <div key={order.id} style={{ ...s.orderCard, animation: 'slideIn 0.3s ease' }}>
              {/* HEADER ROW */}
              <div
                style={s.cardHeader}
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={s.orderId}>{order.id}</span>
                  <span style={s.orderDate}>{order.date}</span>
                  {statusBadge(order.paymentStatus)}
                  {statusBadge(order.orderStatus)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 700, color: '#22c55e', fontSize: '15px' }}>₹{order.total}</span>
                  <span style={{ color: '#94a3b8', fontSize: '18px' }}>{expanded === order.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* EXPANDED DETAILS */}
              {expanded === order.id && (
                <div style={s.cardBody}>
                  <div style={s.detailGrid}>
                    <div style={s.detailSection}>
                      <p style={s.detailTitle}>👤 Customer</p>
                      <p style={s.detailVal}>{order.customer?.name}</p>
                      <p style={s.detailVal}>📞 {order.customer?.phone}</p>
                      <p style={s.detailVal}>📍 {order.customer?.address}</p>
                    </div>
                    <div style={s.detailSection}>
                      <p style={s.detailTitle}>🛒 Items</p>
                      {order.items?.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#374151', marginBottom: '4px' }}>
                          <span>{item.name} ×{item.quantity}</span>
                          <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '8px', paddingTop: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                          <span>Subtotal</span><span>₹{order.subtotal}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                          <span>Delivery</span><span>₹{order.delivery}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                          <span>Total</span><span>₹{order.total}</span>
                        </div>
                      </div>
                    </div>
                    <div style={s.detailSection}>
                      <p style={s.detailTitle}>💳 Payment</p>
                      <p style={s.detailVal}>Method: <b>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (UPI)'}</b></p>
                      <p style={s.detailVal}>Status: {statusBadge(order.paymentStatus)}</p>
                      {order.paymentProof && (
                        <div style={{ marginTop: '10px' }}>
                          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>SCREENSHOT</p>
                          <img
                            src={order.paymentProof}
                            alt="proof"
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0', cursor: 'pointer' }}
                            onClick={() => window.open(order.paymentProof, '_blank')}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
};

const s = {
  page:         { display: 'flex', minHeight: '100vh', fontFamily: "'Outfit', sans-serif", background: '#f8fafc' },
  sidebar:      { width: '220px', background: '#0f172a', display: 'flex', flexDirection: 'column', padding: '28px 16px', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 },
  sidebarLogo:  { fontSize: '20px', fontWeight: 800, color: '#22c55e', marginBottom: '36px', paddingLeft: '8px' },
  nav:          { display: 'flex', flexDirection: 'column', gap: '4px' },
  navLink:      { padding: '10px 14px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 500, fontFamily: "'Outfit', sans-serif" },
  main:         { flex: 1, padding: '32px', overflowY: 'auto' },
  topBar:       { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  heading:      { fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '2px' },
  subheading:   { fontSize: '14px', color: '#64748b' },
  toolbar:      { marginBottom: '16px' },
  searchInput:  { width: '100%', padding: '11px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', fontFamily: "'Outfit', sans-serif", outline: 'none', marginBottom: '12px', background: '#fff', boxSizing: 'border-box' },
  filterRow:    { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  filterBtn:    { padding: '6px 14px', borderRadius: '50px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'all 0.2s' },
  emptyBox:     { background: '#fff', borderRadius: '14px', padding: '40px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  orderCard:    { background: '#fff', borderRadius: '14px', marginBottom: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' },
  cardHeader:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', cursor: 'pointer', flexWrap: 'wrap', gap: '8px' },
  cardBody:     { padding: '0 20px 20px', borderTop: '1px solid #f1f5f9' },
  detailGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', paddingTop: '16px' },
  detailSection:{ },
  detailTitle:  { fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
  detailVal:    { fontSize: '13px', color: '#374151', marginBottom: '4px' },
  orderId:      { fontWeight: 700, fontSize: '13px', color: '#0f172a', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' },
  orderDate:    { fontSize: '12px', color: '#94a3b8' },
};

export default AllOrders;
