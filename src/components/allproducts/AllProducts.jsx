import { useState, useEffect, useMemo } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Link, useLocation } from 'react-router-dom';
import { FiPlus, FiMinus, FiSearch, FiX, FiChevronDown, FiChevronUp, FiSliders } from 'react-icons/fi';
import { useCartStore } from '../../store/useCartStore';
import localProducts from '../../data/products';

/* ─── Skeleton ─── */
const SkeletonCard = () => (
  <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden' }}>
    <div style={{ height: 140, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite' }} />
    <div style={{ padding: 10 }}>
      {[50, 75, 40].map((w, i) => <div key={i} style={{ height: 10, background: '#f1f5f9', borderRadius: 4, marginBottom: 7, width: `${w}%` }} />)}
    </div>
  </div>
);

/* ─── Product Card ─── */
const ProductCard = ({ product }) => {
  const { addToCart, cart, increaseQty, decreaseQty } = useCartStore();
  const item = cart.find(i => i.id === product.id);
  const qty = item?.quantity || 0;
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #f1f5f9' }}>
      <Link to={`/product-details/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative', paddingTop: '75%', background: '#f8fafc', overflow: 'hidden' }}>
          {!imgLoaded && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite' }} />}
          <img src={product.image} alt={product.name}
            onLoad={() => setImgLoaded(true)}
            onError={e => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; setImgLoaded(true); }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }} />
          {product.discount && (
            <span style={{ position: 'absolute', top: 8, left: 8, background: '#22c55e', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 50 }}>
              {product.discount}% OFF
            </span>
          )}
        </div>
        <div style={{ padding: '10px 10px 6px' }}>
          <p style={{ fontSize: 10, color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 3px' }}>{product.category}</p>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 3px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
          {product.weight && <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{product.weight}</p>}
        </div>
      </Link>
      <div style={{ padding: '0 10px 10px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>₹{product.price}</span>
          {product.mrp && product.mrp !== product.price && (
            <span style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through', marginLeft: 4 }}>₹{product.mrp}</span>
          )}
        </div>
        {qty > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#22c55e', borderRadius: 50, padding: '4px 10px' }}>
            <button onClick={() => decreaseQty(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', padding: 0 }}><FiMinus size={12} /></button>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#fff', minWidth: 14, textAlign: 'center' }}>{qty}</span>
            <button onClick={() => increaseQty(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', padding: 0 }}><FiPlus size={12} /></button>
          </div>
        ) : (
          <button onClick={() => addToCart({ ...product, quantity: 1 })}
            style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 50, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <FiPlus size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Filter Section ─── */
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid #f1f5f9', marginBottom: 14 }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px', fontFamily: "'Outfit', sans-serif" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{title}</span>
        {open ? <FiChevronUp size={13} color="#94a3b8" /> : <FiChevronDown size={13} color="#94a3b8" />}
      </button>
      <div style={{ overflow: 'hidden', maxHeight: open ? 500 : 0, opacity: open ? 1 : 0, transition: 'max-height 0.3s ease, opacity 0.2s ease', paddingBottom: open ? 12 : 0 }}>
        {children}
      </div>
    </div>
  );
};

const SORT_OPTIONS = [
  { value: 'default',    label: 'Default' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc',   label: 'Name: A → Z' },
  { value: 'discount',   label: 'Best Discount' },
];

/* ─── Main ─── */
const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get('search') || '');
    const cat = params.get('category');
    if (cat === 'deals') setOnlyDiscount(true);
    else if (cat) setSelectedCategories([cat]);
    window.scrollTo(0, 0);
  }, [location.search]);

  useEffect(() => {
    const db = getDatabase();
    const unsub = onValue(ref(db, 'products'), (snap) => {
      const data = snap.val();
      const firebaseList = data ? Object.entries(data).map(([id, item]) => ({ id, ...item, source: 'firebase' })) : [];
      const localList = localProducts.map(p => ({ ...p, id: `local-${p.id}`, source: 'local' }));
      const firebaseNames = new Set(firebaseList.map(p => p.name?.toLowerCase()));
      const merged = [...firebaseList, ...localList.filter(p => !firebaseNames.has(p.name?.toLowerCase()))];
      setProducts(merged);
      const max = Math.max(...merged.map(p => p.price || 0), 1000);
      setMaxPrice(max);
      setPriceRange([0, max]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const categories = useMemo(() => [...new Set(products.map(p => p.category).filter(Boolean))].sort(), [products]);
  const toggleCategory = (cat) => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const activeFilterCount = useMemo(() => {
    let n = selectedCategories.length;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) n++;
    if (onlyDiscount) n++;
    if (sortBy !== 'default') n++;
    return n;
  }, [selectedCategories, priceRange, maxPrice, onlyDiscount, sortBy]);

  const clearAll = () => { setSelectedCategories([]); setPriceRange([0, maxPrice]); setOnlyDiscount(false); setSortBy('default'); setSearch(''); };

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const q = search.toLowerCase();
      const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
      const matchPrice = (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1];
      const matchDiscount = !onlyDiscount || (p.discount && p.discount > 0);
      return matchCat && matchSearch && matchPrice && matchDiscount;
    });
    if (sortBy === 'price_asc')  list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'name_asc')   list = [...list].sort((a, b) => a.name?.localeCompare(b.name));
    if (sortBy === 'discount')   list = [...list].sort((a, b) => (b.discount || 0) - (a.discount || 0));
    return list;
  }, [products, selectedCategories, search, priceRange, onlyDiscount, sortBy]);

  const FilterPanel = () => (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      <FilterSection title="Sort By">
        {SORT_OPTIONS.map(opt => (
          <label key={opt.value} onClick={() => setSortBy(opt.value)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '7px 8px', borderRadius: 8, background: sortBy === opt.value ? '#f0fdf4' : 'transparent', marginBottom: 2, transition: 'background 0.15s' }}>
            <div style={{ width: 15, height: 15, borderRadius: '50%', border: `2px solid ${sortBy === opt.value ? '#22c55e' : '#d1d5db'}`, background: sortBy === opt.value ? '#22c55e' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {sortBy === opt.value && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
            </div>
            <span style={{ fontSize: 13, fontWeight: sortBy === opt.value ? 700 : 500, color: sortBy === opt.value ? '#15803d' : '#374151' }}>{opt.label}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Categories">
        {categories.map(cat => {
          const count = products.filter(p => p.category === cat).length;
          const active = selectedCategories.includes(cat);
          return (
            <label key={cat} onClick={() => toggleCategory(cat)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '7px 8px', borderRadius: 8, background: active ? '#f0fdf4' : 'transparent', marginBottom: 2, transition: 'background 0.15s' }}>
              <div style={{ width: 15, height: 15, borderRadius: 4, border: `2px solid ${active ? '#22c55e' : '#d1d5db'}`, background: active ? '#22c55e' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {active && <span style={{ color: '#fff', fontSize: 9, fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#15803d' : '#374151' }}>{cat}</span>
              <span style={{ fontSize: 10, color: '#94a3b8', background: '#f1f5f9', padding: '1px 6px', borderRadius: 50 }}>{count}</span>
            </label>
          );
        })}
      </FilterSection>

      <FilterSection title="Price Range">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e' }}>₹{priceRange[0]}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e' }}>₹{priceRange[1]}</span>
        </div>
        <input type="range" min={0} max={maxPrice} value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
          style={{ width: '100%', accentColor: '#22c55e', cursor: 'pointer', marginBottom: 8 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="number" value={priceRange[0]} placeholder="Min"
            onChange={e => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
            style={{ flex: 1, padding: '6px 8px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 12, fontFamily: "'Outfit', sans-serif", outline: 'none' }} />
          <input type="number" value={priceRange[1]} placeholder="Max"
            onChange={e => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
            style={{ flex: 1, padding: '6px 8px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 12, fontFamily: "'Outfit', sans-serif", outline: 'none' }} />
        </div>
      </FilterSection>

      <FilterSection title="Offers" defaultOpen={false}>
        <label onClick={() => setOnlyDiscount(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '7px 8px', borderRadius: 8, background: onlyDiscount ? '#fef9c3' : 'transparent' }}>
          <div style={{ width: 15, height: 15, borderRadius: 4, border: `2px solid ${onlyDiscount ? '#eab308' : '#d1d5db'}`, background: onlyDiscount ? '#eab308' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {onlyDiscount && <span style={{ color: '#fff', fontSize: 9, fontWeight: 900 }}>✓</span>}
          </div>
          <span style={{ fontSize: 13, fontWeight: onlyDiscount ? 700 : 500, color: onlyDiscount ? '#854d0e' : '#374151' }}>On Sale only</span>
        </label>
      </FilterSection>

      {activeFilterCount > 0 && (
        <button onClick={clearAll} style={{ width: '100%', padding: '10px', background: '#fef2f2', color: '#ef4444', border: '1.5px solid #fecaca', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
          ✕ Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes drawerIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        .ap-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .ap-sidebar-desktop { display: none; }
        @media(min-width: 768px) {
          .ap-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
          .ap-sidebar-desktop { display: block; }
        }
        @media(min-width: 1024px) {
          .ap-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>

      {/* ── STICKY TOP BAR ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '12px 16px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Row 1: title + filter btn */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>All Products</h1>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                {loading ? 'Loading...' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button onClick={() => setDrawerOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: activeFilterCount > 0 ? '#f0fdf4' : '#f8fafc', border: `1.5px solid ${activeFilterCount > 0 ? '#86efac' : '#e2e8f0'}`, borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", color: activeFilterCount > 0 ? '#15803d' : '#374151' }}>
              <FiSliders size={13} />
              Filter & Sort
              {activeFilterCount > 0 && <span style={{ background: '#22c55e', color: '#fff', borderRadius: 50, fontSize: 10, fontWeight: 800, padding: '1px 6px' }}>{activeFilterCount}</span>}
            </button>
          </div>

          {/* Row 2: search */}
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }} />
            <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 36px 9px 36px', borderRadius: 50, border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: 'none', background: '#f8fafc', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#22c55e'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                <FiX size={13} />
              </button>
            )}
          </div>

          {/* Active chips */}
          {(selectedCategories.length > 0 || onlyDiscount || sortBy !== 'default') && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
              {selectedCategories.map(cat => (
                <span key={cat} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f0fdf4', border: '1px solid #86efac', color: '#15803d', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>
                  {cat} <button onClick={() => toggleCategory(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803d', display: 'flex', padding: 0 }}><FiX size={10} /></button>
                </span>
              ))}
              {onlyDiscount && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fef9c3', border: '1px solid #fde047', color: '#854d0e', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>
                  On Sale <button onClick={() => setOnlyDiscount(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#854d0e', display: 'flex', padding: 0 }}><FiX size={10} /></button>
                </span>
              )}
              {sortBy !== 'default' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>
                  {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                  <button onClick={() => setSortBy('default')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1d4ed8', display: 'flex', padding: 0 }}><FiX size={10} /></button>
                </span>
              )}
              <button onClick={clearAll} style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: "'Outfit', sans-serif", padding: '3px 6px' }}>Clear all</button>
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* Desktop sidebar */}
        <aside className="ap-sidebar-desktop" style={{ width: 220, flexShrink: 0, background: '#fff', borderRadius: 16, padding: '18px 16px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', position: 'sticky', top: 130 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Filters</span>
            {activeFilterCount > 0 && <button onClick={clearAll} style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Clear all</button>}
          </div>
          <FilterPanel />
        </aside>

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div className="ap-grid">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: '#fff', borderRadius: 16 }}>
              <p style={{ fontSize: 36, marginBottom: 10 }}>🔍</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>No products found</p>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{search ? `No results for "${search}"` : 'Try adjusting your filters.'}</p>
              <button onClick={clearAll} style={{ padding: '10px 24px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: 13 }}>Clear Filters</button>
            </div>
          ) : (
            <div className="ap-grid">
              {filtered.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM SHEET DRAWER (mobile) ── */}
      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 9998, backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', zIndex: 9999, borderRadius: '20px 20px 0 0', padding: '0 20px 32px', maxHeight: '85vh', overflowY: 'auto', animation: 'sheetUp 0.3s ease', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}>
            <style>{`@keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
            {/* Handle */}
            <div style={{ width: 40, height: 4, background: '#e2e8f0', borderRadius: 4, margin: '12px auto 20px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Filter & Sort</span>
              <button onClick={() => setDrawerOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex' }}><FiX size={15} /></button>
            </div>
            <FilterPanel />
            <button onClick={() => setDrawerOpen(false)}
              style={{ width: '100%', marginTop: 16, padding: '14px', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", boxShadow: '0 4px 14px rgba(34,197,94,0.35)' }}>
              Show {filtered.length} Result{filtered.length !== 1 ? 's' : ''}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllProducts;
