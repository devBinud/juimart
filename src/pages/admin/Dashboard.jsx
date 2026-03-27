import React, { useEffect, useState, useRef } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { listenOrders, updateOrder as fbUpdateOrder } from '../../firebase/orderService';
import NewOrderAlert from '../../components/admin/NewOrderAlert';
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
  if (o.orderStatus === 'confirmed') return 'shipped';
  return 'confirmed';
};

const StepTracker = ({ steps, activeKey }) => {
  const activeIdx = steps.findIndex((s) => s.key === activeKey);
  return (
    <div className="step-tracker">
      {steps.map((step, i) => {
        const done = i < activeIdx;
        const current = i === activeIdx;
        return (
          <React.Fragment key={step.key}>
            <div className="step-node">
              <div className={`step-circle ${done ? 'done' : current ? 'current' : 'pending'}`}>
                {done ? '✓' : step.icon}
              </div>
              <span className="step-label" style={{ color: done || current ? '#15803d' : '#94a3b8' }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="step-line" style={{ background: done ? '#22c55e' : '#e2e8f0' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    cod:                  { bg: '#eff6ff', color: '#1d4ed8', label: '💵 COD' },
    verified:             { bg: '#f0fdf4', color: '#15803d', label: '✅ Verified' },
    rejected:             { bg: '#fef2f2', color: '#dc2626', label: '❌ Rejected' },
    pending_verification: { bg: '#fffbeb', color: '#92400e', label: '⏳ Pending' },
    confirmed:            { bg: '#f0fdf4', color: '#15803d', label: '📦 Confirmed' },
    delivered:            { bg: '#ecfdf5', color: '#065f46', label: '🚚 Delivered' },
    cancelled:            { bg: '#fef2f2', color: '#dc2626', label: '🚫 Cancelled' },
  };
  const st = map[status] || { bg: '#f1f5f9', color: '#64748b', label: status };
  return (
    <span className="admin-status-badge" style={{ background: st.bg, color: st.color }}>
      {st.label}
    </span>
  );
};

const NAV_ITEMS = [
  { label: '📊 Dashboard',      href: '/admin/dashboard' },
  { label: '➕ Add Product',     href: '/admin/add-product' },
  { label: '📦 Manage Products', href: '/admin/all-products' },
  { label: '🧾 All Orders',      href: '/admin/all-orders' },
];

const Sidebar = () => (
  <aside className="admin-sidebar">
    <div className="admin-sidebar-logo">🌿 Juimart</div>
    <nav className="admin-nav">
      {NAV_ITEMS.map((item) => (
        <a key={item.href} href={item.href}
          className={`admin-nav-link ${window.location.pathname === item.href ? 'active' : ''}`}>
          {item.label}
        </a>
      ))}
    </nav>
  </aside>
);

const OrderSkeleton = () => (
  <>
    {[...Array(2)].map((_, i) => (
      <div key={i} className="skeleton-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <div className="skeleton" style={{ height: 14, width: 160, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 14, width: 100, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 50 }} />
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...Array(4)].map((_, j) => (
              <div key={j} style={{ display: 'flex', gap: 10 }}>
                <div className="skeleton" style={{ height: 12, width: 70, borderRadius: 4, flexShrink: 0 }} />
                <div className="skeleton" style={{ height: 12, width: '60%', borderRadius: 4 }} />
              </div>
            ))}
          </div>
          <div className="skeleton" style={{ width: 110, height: 110, borderRadius: 12, flexShrink: 0 }} />
        </div>
        <div style={{ marginTop: 16 }}>
          <div className="skeleton" style={{ height: 6, borderRadius: 10, marginBottom: 16 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="skeleton" style={{ height: 40, flex: 1, borderRadius: 10 }} />
            <div className="skeleton" style={{ height: 40, flex: 1, borderRadius: 10 }} />
          </div>
        </div>
      </div>
    ))}
  </>
);

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [codOrders, setCodOrders] = useState([]);
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
      const pending = orders.filter(o => o.paymentStatus === 'pending_verification');
      const cod = orders.filter(o => o.paymentMethod === 'cod');

      // Detect brand new orders (ALL types — COD + online)
      const currentIds = new Set(orders.map(o => o.firebaseKey));
      const brandNew = [...currentIds].filter(id => !prevIdsRef.current.has(id));

      if (brandNew.length > 0 && !isFirstLoadRef.current) {
        const newOrders = orders.filter(o => brandNew.includes(o.firebaseKey));
        setAlertOrders(newOrders);
        setNewOrderIds(prev => new Set([...prev, ...brandNew]));
        setTimers(prev => ({ ...prev, ...Object.fromEntries(brandNew.map(id => [id, 60])) }));
      }

      prevIdsRef.current = currentIds;
      isFirstLoadRef.current = false;
      setPendingOrders(pending);
      setCodOrders(cod);
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

  const tc = (s) => s > 30 ? '#22c55e' : s > 10 ? '#f59e0b' : '#ef4444';

  const stats = [
    { label: 'Products',  value: totalProducts,        icon: '📦', color: '#22c55e', bg: '#f0fdf4' },
    { label: 'Categories',value: totalCategories,      icon: '🏷️', color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Orders',    value: allOrders.length,     icon: '🧾', color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Pending',   value: pendingOrders.length, icon: '⏳', color: pendingOrders.length > 0 ? '#f59e0b' : '#94a3b8', bg: pendingOrders.length > 0 ? '#fffbeb' : '#f8fafc' },
  ];

  return (
    <div className="admin-page">
      {/* 🚨 NEW ORDER SIREN ALERT */}
      <NewOrderAlert
        orders={alertOrders}
        onDismiss={() => setAlertOrders([])}
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

      <Sidebar />

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1 className="admin-heading">Dashboard</h1>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Welcome back, Admin 👋</p>
          </div>
          {pendingOrders.length > 0 && (
            <div className="admin-alert-badge">
              🔔 {pendingOrders.length} pending payment{pendingOrders.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="admin-stats-grid">
          {loading ? (
            // Skeleton stat cards
            [...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-stat">
                <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 10, width: '60%', marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 24, width: '40%' }} />
                </div>
              </div>
            ))
          ) : (
            stats.map(stat => (
              <div key={stat.label} className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: stat.bg, fontSize: 24 }}>{stat.icon}</div>
                <div>
                  <p className="admin-stat-label" style={{ color: stat.color }}>{stat.label}</p>
                  <p className="admin-stat-value">{stat.value}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PENDING PAYMENTS */}
        <div className="admin-section">
          <h2 className="admin-section-title">
            🔔 Pending Payment Verifications
            {pendingOrders.length > 0 && (
              <span className="admin-count-badge" style={{ background: '#ef4444' }}>{pendingOrders.length}</span>
            )}
          </h2>

          {loading ? (
            <OrderSkeleton />
          ) : pendingOrders.length === 0 ? (
            <div className="admin-empty">
              <p style={{ fontSize: 32, marginBottom: 8 }}>✅</p>
              <p style={{ color: '#6b7280', fontWeight: 500 }}>No pending payments right now.</p>
            </div>
          ) : pendingOrders.map(order => {
            const secs = timers[order.firebaseKey] ?? 60;
            const isNew = newOrderIds.has(order.firebaseKey);
            return (
              <div key={order.firebaseKey} className={`admin-order-card ${isNew ? 'new-order' : ''}`}>
                {isNew && <div className="admin-new-badge">✨ New Order</div>}

                <div className="admin-order-top">
                  <div style={{ flex: 1 }}>
                    <div className="admin-order-meta">
                      <span className="admin-order-id">{order.id}</span>
                      <span className="admin-order-date">{order.date}</span>
                      <StatusBadge status={order.paymentStatus} />
                    </div>
                    <div className="admin-info-grid">
                      {[
                        ['Customer', order.customer?.name],
                        ['Phone',    order.customer?.phone],
                        ['Address',  order.customer?.address],
                        ['Items',    order.items?.map(i => `${i.name} ×${i.quantity}`).join(', ')],
                      ].map(([label, value]) => (
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
                      <button className="admin-view-btn" onClick={() => setScreenshotModal(order.paymentProof)}>
                        🔍 View Full
                      </button>
                    </div>
                  )}
                </div>

                {/* TIMER */}
                <div className="admin-timer-section">
                  <div className="admin-timer-row">
                    <span className="admin-timer-label">
                      {secs > 0 ? 'Time to verify' : '⚠️ Expired — verify manually'}
                    </span>
                    <span className="admin-timer-count" style={{ color: tc(secs) }}>{secs}s</span>
                  </div>
                  <div className="admin-timer-track">
                    <div className="admin-timer-fill" style={{ width: `${(secs/60)*100}%`, background: tc(secs) }} />
                  </div>
                </div>

                <div className="admin-actions">
                  <button className="admin-btn admin-btn-green"
                    onClick={() => updateOrder(order.firebaseKey, { paymentStatus: 'verified', orderStatus: 'confirmed' })}>
                    ✅ Verify Payment
                  </button>
                  <button className="admin-btn admin-btn-red"
                    onClick={() => updateOrder(order.firebaseKey, { paymentStatus: 'rejected', orderStatus: 'cancelled' })}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* COD ORDERS */}
        <div className="admin-section">
          <h2 className="admin-section-title">
            💵 Cash on Delivery Orders
            {codOrders.length > 0 && (
              <span className="admin-count-badge" style={{ background: '#3b82f6' }}>{codOrders.length}</span>
            )}
          </h2>

          {loading ? (
            <OrderSkeleton />
          ) : codOrders.length === 0 ? (
            <div className="admin-empty">
              <p style={{ color: '#6b7280', fontWeight: 500 }}>No COD orders yet.</p>
            </div>
          ) : codOrders.map(order => (
            <div key={order.firebaseKey} className="admin-order-card">
              <div className="admin-order-meta">
                <span className="admin-order-id">{order.id}</span>
                <span className="admin-order-date">{order.date}</span>
                <StatusBadge status={order.orderStatus === 'delivered' ? 'delivered' : order.orderStatus === 'cancelled' ? 'cancelled' : 'cod'} />
              </div>

              <div className="admin-info-grid">
                {[
                  ['Customer', order.customer?.name],
                  ['Phone',    order.customer?.phone],
                  ['Address',  order.customer?.address],
                  ['Items',    order.items?.map(i => `${i.name} ×${i.quantity}`).join(', ')],
                ].map(([label, value]) => (
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

              {order.orderStatus !== 'cancelled' && (
                <StepTracker steps={COD_STEPS} activeKey={getCodStep(order)} />
              )}

              {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                <div className="admin-actions" style={{ marginTop: 16 }}>
                  <button className="admin-btn admin-btn-blue"
                    onClick={() => updateOrder(order.firebaseKey, { orderStatus: 'confirmed' })}>
                    📦 Confirm
                  </button>
                  <button className="admin-btn admin-btn-purple"
                    onClick={() => updateOrder(order.firebaseKey, { orderStatus: 'delivered' })}>
                    🚚 Delivered
                  </button>
                  <button className="admin-btn admin-btn-red"
                    onClick={() => updateOrder(order.firebaseKey, { orderStatus: 'cancelled' })}>
                    ❌ Cancel
                  </button>
                </div>
              )}
              {order.orderStatus === 'delivered' && (
                <p style={{ marginTop: 12, color: '#15803d', fontWeight: 600, fontSize: 14 }}>🎉 Delivered successfully</p>
              )}
              {order.orderStatus === 'cancelled' && (
                <p style={{ marginTop: 12, color: '#dc2626', fontWeight: 600, fontSize: 14 }}>🚫 Order cancelled</p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
