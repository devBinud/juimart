import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import './admin.css';

const NAV_ITEMS = [
  { label: '📊 Dashboard',      href: '/admin/dashboard' },
  { label: '➕ Add Product',     href: '/admin/add-product' },
  { label: '📦 Manage Products', href: '/admin/all-products' },
  { label: '🧾 All Orders',      href: '/admin/all-orders' },
];

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Spices', 'Dairy', 'Grains', 'Beverages', 'Snacks', 'Other'];

const Skeleton = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
    {[...Array(6)].map((_, i) => (
      <div key={i} style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ height: 180, background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div style={{ padding: 16 }}>
          <div style={{ height: 14, background: '#f1f5f9', borderRadius: 6, marginBottom: 8, width: '70%' }} />
          <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, width: '40%' }} />
        </div>
      </div>
    ))}
    <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
  </div>
);

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const db = getDatabase();
    const unsub = onValue(ref(db, 'products'), (snap) => {
      const data = snap.val();
      if (!data) { setProducts([]); setLoading(false); return; }
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val })).reverse();
      setProducts(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return;
    const db = getDatabase();
    remove(ref(db, `products/${id}`))
      .then(() => showToast('Product deleted'))
      .catch(() => showToast('Delete failed', 'error'));
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const db = getDatabase();
      const { id, ...data } = editProduct;
      await update(ref(db, `products/${id}`), data);
      showToast('Product updated!');
      setEditProduct(null);
    } catch {
      showToast('Update failed', 'error');
    }
    setSaving(false);
  };

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-page">
      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: toast.type === 'error' ? '#fef2f2' : '#f0fdf4',
          color: toast.type === 'error' ? '#dc2626' : '#15803d',
          padding: '12px 20px', borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          fontWeight: 600, fontSize: 14,
        }}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      {/* VIEW MODAL */}
      {viewProduct && (
        <div className="admin-modal-overlay" onClick={() => setViewProduct(null)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="admin-modal-header">
              <span style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>Product Details</span>
              <button className="admin-close-btn" onClick={() => setViewProduct(null)}>✕</button>
            </div>
            <img src={viewProduct.image} alt={viewProduct.name} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['Name', viewProduct.name],
                ['Category', viewProduct.category],
                ['MRP', `₹${viewProduct.mrp}`],
                ['Price', `₹${viewProduct.price}`],
                ['Discount', `${viewProduct.discount || 0}%`],
              ].map(([label, value]) => (
                <div key={label} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{value}</p>
                </div>
              ))}
            </div>
            {viewProduct.description && (
              <div style={{ marginTop: 12, background: '#f8fafc', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Description</p>
                <p style={{ fontSize: 13, color: '#374151' }}>{viewProduct.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editProduct && (
        <div className="admin-modal-overlay" onClick={() => setEditProduct(null)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="admin-modal-header">
              <span style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>Edit Product</span>
              <button className="admin-close-btn" onClick={() => setEditProduct(null)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Product Name', key: 'name', type: 'text' },
                { label: 'Category', key: 'category', type: 'text' },
                { label: 'MRP (₹)', key: 'mrp', type: 'number' },
                { label: 'Price (₹)', key: 'price', type: 'number' },
                { label: 'Discount (%)', key: 'discount', type: 'number' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>{label}</label>
                  <input
                    type={type}
                    value={editProduct[key] || ''}
                    onChange={e => setEditProduct(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Description</label>
                <textarea
                  value={editProduct.description || ''}
                  onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: 'none', boxSizing: 'border-box', height: 80, resize: 'vertical' }}
                />
              </div>
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="admin-btn admin-btn-green"
                style={{ width: '100%', justifyContent: 'center', padding: 12, opacity: saving ? 0.7 : 1 }}
              >
                {saving ? '⏳ Saving...' : '✅ Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">🌿 Juimart</div>
        <nav className="admin-nav">
          {NAV_ITEMS.map(item => (
            <a key={item.href} href={item.href}
              className={`admin-nav-link ${window.location.pathname === item.href ? 'active' : ''}`}>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1 className="admin-heading">Manage Products</h1>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{products.length} products total</p>
          </div>
          <a href="/admin/add-product" style={{ textDecoration: 'none' }}>
            <button className="admin-btn admin-btn-green">➕ Add Product</button>
          </a>
        </div>

        {/* SEARCH + FILTER */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            placeholder="🔍 Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: 'none', background: '#fff' }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)} style={{
                padding: '7px 14px', borderRadius: 50, border: 'none', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                background: filterCat === cat ? '#22c55e' : '#f1f5f9',
                color: filterCat === cat ? '#fff' : '#374151',
                transition: 'all 0.2s',
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
          Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </p>

        {loading ? <Skeleton /> : filtered.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 18, padding: 48, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>📭</p>
            <p style={{ color: '#6b7280', fontWeight: 500 }}>No products found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {filtered.map(p => (
              <div key={p.id} style={{
                background: '#fff', borderRadius: 18, overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
              >
                <div style={{ position: 'relative' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  {p.discount && (
                    <span style={{
                      position: 'absolute', top: 10, right: 10,
                      background: '#22c55e', color: '#fff',
                      fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 50,
                    }}>
                      {p.discount}% OFF
                    </span>
                  )}
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                  <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>{p.category}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <span style={{ fontWeight: 800, color: '#22c55e', fontSize: 16 }}>₹{p.price}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>₹{p.mrp}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setViewProduct(p)} style={{
                      flex: 1, padding: '8px', borderRadius: 8, border: 'none',
                      background: '#f1f5f9', color: '#374151', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                    }}>
                      👁 View
                    </button>
                    <button onClick={() => setEditProduct(p)} style={{
                      flex: 1, padding: '8px', borderRadius: 8, border: 'none',
                      background: '#eff6ff', color: '#1d4ed8', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                    }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} style={{
                      flex: 1, padding: '8px', borderRadius: 8, border: 'none',
                      background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                    }}>
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllProduct;
