import { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import './admin.css';

const CATEGORIES = ['Fruits', 'Vegetables', 'Spices', 'Dairy', 'Grains', 'Beverages', 'Snacks', 'Other'];

const NAV_ITEMS = [
  { label: '📊 Dashboard', href: '/admin/dashboard' },
  { label: '➕ Add Product', href: '/admin/add-product' },
  { label: '📦 Manage Products', href: '/admin/all-products' },
  { label: '🧾 All Orders', href: '/admin/all-orders' },
];

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '', slug: '', category: '',
    description: '', longDesc1: '', longDesc2: '', longDesc3: '',
    mrp: '', discount: '', price: '',
  });
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const generateSlug = (name) =>
    name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const handleNameChange = (e) => {
    const name = e.target.value;
    setProduct(p => ({ ...p, name, slug: generateSlug(name) }));
  };

  const handlePricing = (field, value) => {
    const updated = { ...product, [field]: value };
    if (updated.mrp && updated.discount) {
      updated.price = Math.round(
        parseFloat(updated.mrp) - (parseFloat(updated.mrp) * parseFloat(updated.discount)) / 100
      ).toString();
    }
    setProduct(updated);
  };

  const handleUpload = () => {
    if (!window.cloudinary) {
      showToast('Cloudinary not loaded', 'error');
      return;
    }
    window.cloudinary.openUploadWidget(
      { cloudName: 'dev-binudstorage', uploadPreset: 'mrittika_unsigned', sources: ['local'], multiple: false, cropping: false },
      (error, result) => {
        if (!error && result.event === 'success') setImageUrl(result.info.secure_url);
        else if (error) showToast('Upload failed', 'error');
      }
    );
  };

  const handleSave = async () => {
    const { name, slug, category, mrp, price } = product;
    if (!name || !slug || !category || !mrp || !price || !imageUrl) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setSaving(true);
    try {
      const db = getDatabase();
      await push(ref(db, 'products'), { ...product, image: imageUrl, createdAt: Date.now() });
      showToast('Product added successfully!');
      setProduct({ name: '', slug: '', category: '', description: '', longDesc1: '', longDesc2: '', longDesc3: '', mrp: '', discount: '', price: '' });
      setImageUrl('');
    } catch (e) {
      showToast('Failed to save product', 'error');
    }
    setSaving(false);
  };

  const discount = product.mrp && product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

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
          animation: 'slideUp 0.3s ease',
        }}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
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
            <h1 className="admin-heading">Add Product</h1>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Fill in the details to add a new product</p>
          </div>
          <a href="/admin/all-products" style={{ textDecoration: 'none' }}>
            <button className="admin-btn admin-btn-blue">📦 View All Products</button>
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* LEFT — FORM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* BASIC INFO */}
            <div style={card}>
              <h3 style={cardTitle}>Basic Information</h3>
              <div style={grid2}>
                <Field label="Product Name *">
                  <input style={input} placeholder="e.g. Organic Spinach" value={product.name} onChange={handleNameChange} />
                </Field>
                <Field label="Slug (auto-generated)">
                  <input style={{ ...input, background: '#f8fafc', color: '#94a3b8' }} value={product.slug} readOnly />
                </Field>
              </div>
              <Field label="Category *">
                <select style={input} value={product.category} onChange={e => setProduct(p => ({ ...p, category: e.target.value }))}>
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            {/* DESCRIPTIONS */}
            <div style={card}>
              <h3 style={cardTitle}>Descriptions</h3>
              <Field label="Short Description *">
                <textarea style={{ ...input, height: 80, resize: 'vertical' }}
                  placeholder="Brief product description..."
                  value={product.description}
                  onChange={e => setProduct(p => ({ ...p, description: e.target.value }))} />
              </Field>
              <Field label="Additional Info (optional)">
                <textarea style={{ ...input, height: 70, resize: 'vertical' }}
                  placeholder="More details about the product..."
                  value={product.longDesc1}
                  onChange={e => setProduct(p => ({ ...p, longDesc1: e.target.value }))} />
              </Field>
              <div style={grid2}>
                <Field label="Extra Info 1 (optional)">
                  <textarea style={{ ...input, height: 60, resize: 'vertical' }}
                    value={product.longDesc2}
                    onChange={e => setProduct(p => ({ ...p, longDesc2: e.target.value }))} />
                </Field>
                <Field label="Extra Info 2 (optional)">
                  <textarea style={{ ...input, height: 60, resize: 'vertical' }}
                    value={product.longDesc3}
                    onChange={e => setProduct(p => ({ ...p, longDesc3: e.target.value }))} />
                </Field>
              </div>
            </div>

            {/* PRICING */}
            <div style={card}>
              <h3 style={cardTitle}>Pricing</h3>
              <div style={grid3}>
                <Field label="MRP (₹) *">
                  <input style={input} type="number" placeholder="0" value={product.mrp}
                    onChange={e => handlePricing('mrp', e.target.value)} />
                </Field>
                <Field label="Discount (%)">
                  <input style={input} type="number" placeholder="0" value={product.discount}
                    onChange={e => handlePricing('discount', e.target.value)} />
                </Field>
                <Field label="Final Price (₹)">
                  <input style={{ ...input, background: '#f0fdf4', color: '#15803d', fontWeight: 700 }}
                    type="number" value={product.price} readOnly />
                </Field>
              </div>
              {product.mrp && product.price && (
                <div style={{ marginTop: 10, padding: '10px 14px', background: '#f0fdf4', borderRadius: 10, fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                  💰 Customer saves ₹{product.mrp - product.price} ({discount}% off)
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — IMAGE + SAVE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={card}>
              <h3 style={cardTitle}>Product Image</h3>
              <div
                onClick={handleUpload}
                style={{
                  border: '2px dashed #e2e8f0',
                  borderRadius: 14,
                  padding: '32px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: imageUrl ? '#f0fdf4' : '#f8fafc',
                  transition: 'all 0.2s',
                  minHeight: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10 }} />
                    <p style={{ fontSize: 12, color: '#22c55e', fontWeight: 600, marginTop: 8 }}>✅ Image uploaded — click to change</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 36 }}>🖼️</div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Click to upload image</p>
                    <p style={{ fontSize: 12, color: '#94a3b8' }}>JPG, PNG, WEBP supported</p>
                  </>
                )}
              </div>
            </div>

            {/* PREVIEW CARD */}
            {(product.name || imageUrl) && (
              <div style={card}>
                <h3 style={cardTitle}>Preview</h3>
                <div style={{ borderRadius: 12, overflow: 'hidden', background: '#f8fafc' }}>
                  {imageUrl && <img src={imageUrl} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover' }} />}
                  <div style={{ padding: '12px 14px' }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 4 }}>{product.name || 'Product Name'}</p>
                    {product.category && <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{product.category}</p>}
                    {product.price && (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: '#22c55e', fontSize: 16 }}>₹{product.price}</span>
                        {product.mrp && <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>₹{product.mrp}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="admin-btn admin-btn-green"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? '⏳ Saving...' : '✅ Save Product'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const card = {
  background: '#fff',
  borderRadius: 18,
  padding: '24px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
};

const cardTitle = {
  fontSize: 15,
  fontWeight: 700,
  color: '#0f172a',
  marginBottom: 18,
  paddingBottom: 12,
  borderBottom: '1px solid #f1f5f9',
};

const input = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1.5px solid #e2e8f0',
  fontSize: 14,
  fontFamily: "'Outfit', sans-serif",
  color: '#0f172a',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };
const grid3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 };

export default AddProduct;
