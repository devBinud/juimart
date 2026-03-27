import { useState, useEffect, useMemo } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Link, useLocation } from 'react-router-dom';
import { FiPlus, FiMinus, FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useCartStore } from '../../store/useCartStore';

const SkeletonCard = () => (
  <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
    <div style={{ height: 180, background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.5s infinite' }} />
    <div style={{ padding: 14 }}>
      {[60, 80, 40].map((w, i) => (
        <div key={i} style={{ height: i === 1 ? 14 : 12, background: '#f1f5f9', borderRadius: 6, marginBottom: 8, width: `${w}%` }} />
      ))}
    </div>
  </div>
);

const ProductCard = ({ product }) => {
  const { addToCart, cart, increaseQty, decreaseQty } = useCartStore();
  const item = cart.find(i => i.id === product.id);
  const qty = item?.quantity || 0;
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}>
      <Link to={`/product-details/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative', height: 180, background: '#f8fafc', overflow: 'hidden' }}>
          {!imgLoaded && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.5s infinite' }} />}
          <img src={product.image} alt={product.name}
            onLoad={() => setImgLoaded(true)}
            onError={e => { e.target.src = 'https://via.placeholder.com/300x180?text=No+Image'; setImgLoaded(true); }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }} />
          {product.discount && (
            <span style={{ position: 'absolute', top: 10, left: 10, background: '#22c55e', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 50 }}>
              {product.discount}% OFF
            </span>
          )}
        </div>
        <div style={{ padding: '12px 14px 8px' }}>
          <p style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{product.category}</p>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
          {product.weight && <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{product.weight}</p>}
        </div>
      </Link>
      <div style={{ padding: '0 14px 14px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>₹{product.price}</span>
          {product.mrp && product.mrp !== product.price && (
            <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through', marginLeft: 6 }}>₹{product.mrp}</span>
          )}
        </div>
        {qty > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', borderRadius: 50, padding: '4px 10px' }}>
            <button onClick={() => decreaseQty(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', display: 'flex', padding: 2 }}><FiMinus size={14} /></button>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#15803d', minWidth: 16, textAlign: 'center' }}>{qty}</span>
            <button onClick={() => increaseQty(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', display: 'flex', padding: 2 }}><FiPlus size={14} /></button>
          </div>
        ) : (
          <button onClick={() => addToCart({ ...product, quantity: 1 })}
            style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 50, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(34,197,94,0.3)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#16a34a'}
            onMouseLeave={e => e.currentTarget.style.background = '#22c55e'}>
            <FiPlus size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 4, marginBottom: 16 }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px', fontFamily: "'Outfit', sans-serif" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{title}</span>
        {open ? <FiChevronUp size={14} color="#94a3b8" /> : <FiChevronDown size={14} color="#94a3b8" />}
      </button>
      <div style={{ overflow: 'hidden', maxHeight: open ? 500 : 0, opacity: open ? 1 : 0, transition: 'max-height 0.3s ease, opacity 0.2s ease', paddingBottom: open ? 12 : 0 }}>
        {children}
      </div>
    </div>
  );
};

const SORT_OPTIONS = [
  { value: 'default',   label: 'Default' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc',label: 'Price: High → Low' },
  { value: 'name_asc',  label: 'Name: A → Z' },
  { value: 'discount',  label: 'Best Discount' },
];

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
    window.scrollTo(0, 0);
  }, [location.search]);

  useEffect(() => {
    const db = getDatabase();
    const unsub = onValue(ref(db, 'products'), (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, item]) => ({ id, ...item }));
        setProducts(list);
        const max = Math.max(...list.map(p => p.price || 0), 1000);
        setMaxPrice(max);
        setPriceRange([0, max]);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return [...cats].sort();
  }, [products]);

  const toggleCategory = (cat) =>
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const activeFilterCount = useMemo(() => {
    let n = selectedCategories.length;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) n++;
    if (onlyDiscount) n++;
    if (sortBy !== 'default') n++;
    return n;
  }, [selectedCategories, priceRange, maxPrice, onlyDiscount, sortBy]);

  const clearAll = () => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setOnlyDiscount(false);
    setSortBy('default');
    setSearch('');
  };

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const q = search.toLowerCase();
      const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
      const matchPrice = (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1];
      const matchDiscount = !onlyDiscount || (p.discount && p.discount > 0);
      return matchCat && matchSearch && matchPrice && matchDiscount;
    });
    if (sortBy === 'price_asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === 'name_asc') list = [...list].sort((a, b) => a.name?.localeCompare(b.name));
    else if (sortBy === 'discount') list = [...list].sort((a, b) => (b.discount || 0) - (a.discount || 0));
    return list;
  }, [products, selectedCategories, search, priceRange, onlyDiscount, sortBy]);

  const FilterPanel = () => (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      <FilterSection title="Sort By">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SORT_OPTIONS.map(opt => (
            <label key={opt.value} onClick={() => setSortBy(opt.value)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 10px', borderRadius: 10, background: sortBy === opt.value ? '#f0fdf4' : 'transparent', border: `1.5px solid ${sortBy === opt.value ? '#86efac' : 'transparent'}`, transition: 'all 0.15s' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${sortBy === opt.value ? '#22c55e' : '#d1d5db'}`, background: sortBy === opt.value ? '#22c55e' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                {sortBy === opt.value && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
              </div>
              <span style={{ fontSize: 13, fontWeight: sortBy === opt.value ? 700 : 500, color: sortBy === opt.value ? '#15803d' : '#374151' }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Categories">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            const active = selectedCategories.includes(cat);
            return (
              <label key={cat} onClick={() => toggleCategory(cat)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 10px', borderRadius: 10, background: active ? '#f0fdf4' : 'transparent', border: `1.5px solid ${active ? '#86efac' : 'transparent'}`, transition: 'all 0.15s' }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${active ? '#22c55e' : '#d1d5db'}`, background: active ? '#22c55e' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                  {active && <span style={{ color: '#fff', fontSize: 10, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                </div>
                <span style={{ flex: 1, fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#15803d' : '#374151' }}>{cat}</span>
                <span style={{ fontSize: 11, color: '#94a3b8', background: '#f1f5f9', padding: '1px 7px', borderRadius: 50 }}>{count}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div style={{ padding: '0 2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>₹{priceRange[0]}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>₹{priceRange[1]}</span>
          </div>
          <input type="range" min={0} max={maxPrice} value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            style={{ width: '100%', accentColor: '#22c55e', cursor: 'pointer', marginBottom: 10 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" min={0} max={priceRange[1]} value={priceRange[0]} placeholder="Min"
              onChange={e => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
              style={{ flex: 1, padding: '6px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: 'none' }} />
            <input type="number" min={priceRange[0]} max={maxPrice} value={priceRange[1]} placeholder="Max"
              onChange={e => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
              style={{ flex: 1, padding: '6px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: 'none' }} />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Offers" defaultOpen={false}>
        <label onClick={() => setOnlyDiscount(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 10px', borderRadius: 10, background: onlyDiscount ? '#fef9c3' : 'transparent', border: `1.5px solid ${onlyDiscount ? '#fde047' : 'transparent'}`, transition: 'all 0.15s' }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${onlyDiscount ? '#eab308' : '#d1d5db'}`, background: onlyDiscount ? '#eab308' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
            {onlyDiscount && <span style={{ color: '#fff', fontSize: 10, fontWeight: 900, lineHeight: 1 }}>✓</span>}
          </div>
          <span style={{ fontSize: 13, fontWeight: onlyDiscount ? 700 : 500, color: onlyDiscount ? '#854d0e' : '#374151' }}>On Sale / Discounted only</span>
        </label>
      </FilterSection>

      {activeFilterCount > 0 && (
        <button onClick={clearAll} style={{ width: '100%', padding: '10px', background: '#fef2f2', color: '#ef4444', border: '1.5px solid #fecaca', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif', marginTop: 4" }}>
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
        @media (max-width: 480px) {
          .juimart-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .ap-sidebar { display: none !important; }
        }
      `}</style>

      {/* TOP BAR */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '20px 24px 16px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 auto' }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>All Products</h1>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 2, marginBottom: 0 }}>
                {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}${search ? ` for "${search}"` : ''}`}
              </p>
            </div>
            <div style={{ position: 'relative', flex: 1, maxWidth: 400, minWidth: 180 }}>
              <FiSearch style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '9px 36px 9px 38px', borderRadius: 50, border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: 'none', background: '#f8fafc', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#22c55e'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                  <FiX size={14} />
                </button>
              )}
            </div>
            <button onClick={() => setDrawerOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: activeFilterCount > 0 ? '#f0fdf4' : '#f8fafc', border: `1.5px solid ${activeFilterCount > 0 ? '#86efac' : '#e2e8f0'}`, borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", color: activeFilterCount > 0 ? '#15803d' : '#374151', transition: 'all 0.2s' }}>
              <FiFilter size={14} />
              Filters
              {activeFilterCount > 0 && <span style={{ background: '#22c55e', color: '#fff', borderRadius: 50, fontSize: 11, fontWeight: 800, padding: '1px 7px' }}>{activeFilterCount}</span>}
            </button>
          </div>

          {/* Active chips */}
          {(selectedCategories.length > 0 || onlyDiscount || sortBy !== 'default') && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              {selectedCategories.map(cat => (
                <span key={cat} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0fdf4', border: '1px solid #86efac', color: '#15803d', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 50 }}>
                  {cat} <button onClick={() => toggleCategory(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803d', display: 'flex', padding: 0 }}><FiX size={11} /></button>
                </span>
              ))}
              {onlyDiscount && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#fef9c3', border: '1px solid #fde047', color: '#854d0e', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 50 }}>
                  On Sale <button onClick={() => setOnlyDiscount(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#854d0e', display: 'flex', padding: 0 }}><FiX size={11} /></button>
                </span>
              )}
              {sortBy !== 'default' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 50 }}>
                  {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                  <button onClick={() => setSortBy('default')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1d4ed8', display: 'flex', padding: 0 }}><FiX size={11} /></button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BODY */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* SIDEBAR */}
        <aside className="ap-sidebar" style={{ width: 240, flexShrink: 0, background: '#fff', borderRadius: 18, padding: '20px 18px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', position: 'sticky', top: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Filters</span>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Clear all</button>
            )}
          </div>
          <FilterPanel />
        </aside>

        {/* GRID */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16 }}>
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 18 }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>No products found</p>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>{search ? `No results for "${search}"` : 'Try adjusting your filters.'}</p>
              <button onClick={clearAll} style={{ padding: '10px 24px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 50, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>Clear Filters</button>
            </div>
          ) : (
            <div className="juimart-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16 }}>
              {filtered.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 9998, backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 300, background: '#fff', zIndex: 9999, padding: '24px 20px', overflowY: 'auto', animation: 'drawerIn 0.3s ease', boxShadow: '8px 0 32px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>Filters</span>
              <button onClick={() => setDrawerOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex' }}><FiX size={16} /></button>
            </div>
            <FilterPanel />
            <button onClick={() => setDrawerOpen(false)} style={{ width: '100%', marginTop: 16, padding: '12px', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
              Show {filtered.length} Results
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllProducts;
