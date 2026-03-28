import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { FaWhatsapp } from "react-icons/fa";
import { FiShoppingCart, FiArrowLeft, FiPlus, FiMinus, FiCheck, FiTag, FiPackage } from "react-icons/fi";
import localProducts from "../../data/products";
import { useCartStore } from "../../store/useCartStore";

const S = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Outfit', sans-serif",
  },
  breadcrumb: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "20px 24px 0",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#94a3b8",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#64748b",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Outfit', sans-serif",
    padding: "6px 10px",
    borderRadius: 8,
    transition: "all 0.2s",
  },
  card: {
    maxWidth: 1100,
    margin: "20px auto 60px",
    padding: "0 24px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 48,
    alignItems: "start",
  },
  imgBox: {
    background: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    aspectRatio: "1",
    maxWidth: 360,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  right: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    paddingTop: 8,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#f0fdf4",
    color: "#16a34a",
    fontSize: 12,
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: 50,
    border: "1px solid #bbf7d0",
    width: "fit-content",
  },
  name: {
    fontSize: 32,
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1.2,
    letterSpacing: "-0.5px",
    margin: 0,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#64748b",
    fontWeight: 500,
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 13,
    color: "#f59e0b",
    fontWeight: 700,
  },
  divider: {
    height: 1,
    background: "#f1f5f9",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 12,
  },
  price: {
    fontSize: 36,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-1px",
  },
  mrp: {
    fontSize: 18,
    color: "#94a3b8",
    textDecoration: "line-through",
    fontWeight: 500,
  },
  discountBadge: {
    background: "#fef2f2",
    color: "#ef4444",
    fontSize: 12,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 50,
    border: "1px solid #fecaca",
  },
  desc: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 1.7,
    margin: 0,
  },
  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  qtyLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
    minWidth: 60,
  },
  qtyControl: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: 12,
    overflow: "hidden",
  },
  qtyBtn: {
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#0f172a",
    fontSize: 16,
    transition: "background 0.15s",
    fontFamily: "'Outfit', sans-serif",
  },
  qtyNum: {
    width: 44,
    textAlign: "center",
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
  },
  addBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "14px 28px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
    transition: "all 0.2s",
    boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
  },
  addedBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "14px 28px",
    background: "#f0fdf4",
    color: "#16a34a",
    border: "2px solid #22c55e",
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
    transition: "all 0.2s",
  },
  waBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "13px 28px",
    background: "#fff",
    color: "#16a34a",
    border: "1.5px solid #22c55e",
    borderRadius: 14,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
    textDecoration: "none",
    transition: "all 0.2s",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  infoCard: {
    background: "#f8fafc",
    border: "1px solid #f1f5f9",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#22c55e",
    fontSize: 16,
    flexShrink: 0,
  },
  infoText: {
    fontSize: 12,
    color: "#94a3b8",
    margin: "0 0 2px",
    fontWeight: 500,
  },
  infoVal: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: 700,
    margin: 0,
  },
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = useCartStore((s) => s.addToCart);
  const cart = useCartStore((s) => s.cart);
  const openCart = useCartStore((s) => s.openCart);

  const cartItem = cart.find((i) => i.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetch = async () => {
      if (id.startsWith("local-")) {
        const localId = parseInt(id.replace("local-", ""), 10);
        const found = localProducts.find((p) => p.id === localId);
        setProduct(found ? { ...found, id } : null);
        setLoading(false);
        return;
      }
      const db = getDatabase();
      try {
        const snap = await get(ref(db, `products/${id}`));
        setProduct(snap.exists() ? { ...snap.val(), id } : null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({ ...product, id: product.id });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, border: "3px solid #e2e8f0", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#64748b", fontFamily: "'Outfit', sans-serif", fontSize: 14 }}>Loading product...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 48, margin: "0 0 12px" }}>😕</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>Product not found</p>
        <button onClick={() => navigate(-1)} style={{ ...S.addBtn, marginTop: 16, flex: "none" }}>Go Back</button>
      </div>
    </div>
  );

  const discount = product.discount || (product.mrp && product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : null);

  return (
    <div style={S.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @media (max-width: 768px) { .pd-grid { grid-template-columns: 1fr !important; } }`}</style>

      {/* Breadcrumb */}
      <div style={S.breadcrumb}>
        <button style={S.backBtn} onClick={() => navigate(-1)}>
          <FiArrowLeft size={15} /> Back
        </button>
        <span>/</span>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main Card */}
      <div style={S.card} className="pd-grid">

        {/* Image */}
        <div style={S.imgBox}>
          <img src={product.image} alt={product.name} style={S.img}
            onError={e => { e.target.src = "https://via.placeholder.com/400x400?text=No+Image"; }} />
        </div>

        {/* Details */}
        <div style={S.right}>

          {/* Category badge */}
          <div style={S.badge}>
            <FiTag size={11} />
            {product.category || "General"}
          </div>

          {/* Name */}
          <h1 style={S.name}>{product.name}</h1>

          {/* Meta */}
          <div style={S.meta}>
            {product.weight && (
              <div style={S.metaItem}>
                <FiPackage size={13} />
                {product.weight}
              </div>
            )}
            <div style={{ ...S.metaItem, color: "#22c55e", fontWeight: 700 }}>
              ✓ In Stock
            </div>
          </div>

          <div style={S.divider} />

          {/* Price */}
          <div style={S.priceRow}>
            <span style={S.price}>₹{product.price}</span>
            {product.mrp && <span style={S.mrp}>₹{product.mrp}</span>}
            {discount && <span style={S.discountBadge}>{discount}% OFF</span>}
          </div>

          {/* Description */}
          {product.description && (
            <p style={S.desc}>{product.description}</p>
          )}

          <div style={S.divider} />

          {/* Qty + Add to Cart */}
          <div style={S.qtyRow}>
            <span style={S.qtyLabel}>Qty</span>
            <div style={S.qtyControl}>
              <button style={S.qtyBtn}
                onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
                onClick={() => setQty(q => Math.max(1, q - 1))}>
                <FiMinus size={14} />
              </button>
              <span style={S.qtyNum}>{qty}</span>
              <button style={S.qtyBtn}
                onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
                onClick={() => setQty(q => q + 1)}>
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              style={added ? S.addedBtn : S.addBtn}
              onClick={handleAddToCart}
              onMouseEnter={e => { if (!added) e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
            >
              {added ? <FiCheck size={18} /> : <FiShoppingCart size={18} />}
              {added ? "Added to Cart!" : `Add ${qty > 1 ? `${qty} items` : "to Cart"} • ₹${product.price * qty}`}
            </button>
          </div>

          {cartItem && (
            <button
              onClick={openCart}
              style={{ background: "none", border: "none", color: "#22c55e", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif", textAlign: "left", padding: 0 }}
            >
              🛒 {cartItem.quantity} already in cart — view cart →
            </button>
          )}

          {/* WhatsApp */}
          <a
            href={`https://wa.me/919706393924?text=${encodeURIComponent(
              `*Hello Zui Quick Mart,*\n\nI'm interested in:\n\n✨ *${product.name}*\n💰 *Price:* ₹${product.price}\n\nPlease share more details. Thank you!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={S.waBtn}
            onMouseEnter={e => { e.currentTarget.style.background = "#f0fdf4"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
          >
            <FaWhatsapp size={18} color="#25d366" />
            Enquire via WhatsApp
          </a>

          {/* Info Grid */}
          <div style={S.infoGrid}>
            {[
              { icon: "🚚", label: "Delivery", val: "Same day delivery" },
              { icon: "↩️", label: "Returns", val: "Easy 7-day returns" },
              { icon: "✅", label: "Quality", val: "100% Fresh & Natural" },
              { icon: "🔒", label: "Payment", val: "Secure checkout" },
            ].map(({ icon, label, val }) => (
              <div key={label} style={S.infoCard}>
                <div style={S.infoIcon}>{icon}</div>
                <div>
                  <p style={S.infoText}>{label}</p>
                  <p style={S.infoVal}>{val}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
