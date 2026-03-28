import React from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import products from "../../data/products";
import { FiPlus, FiMinus, FiZap } from "react-icons/fi";

const QuickPicks = () => {
  const navigate = useNavigate();
  const { addToCart, cart, increaseQty, decreaseQty } = useCartStore();
  const list = products.slice(0, 12);

  return (
    <div style={{ maxWidth: 1200, margin: "16px auto 0", padding: "0 16px", fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 18, padding: "18px 0 4px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 18px", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <FiZap size={16} color="#22c55e" />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>Quick Picks</h2>
          </div>
          <button onClick={() => navigate("/all-products")}
            style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
            View all →
          </button>
        </div>

        {/* Scroll */}
        <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 18px 16px", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {list.map(product => {
            const item = cart.find(i => i.id === product.id);
            const qty = item?.quantity || 0;
            return (
              <div key={product.id} style={{
                flexShrink: 0, width: 130,
                background: "#fff", borderRadius: 14,
                border: "1px solid #f1f5f9",
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                transition: "transform 0.18s, box-shadow 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.09)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.05)"; }}
              >
                {/* Image — same height as DealsStrip */}
                <div onClick={() => navigate(`/product-details/local-${product.id}`)}
                  style={{ height: 110, background: "#f8fafc", overflow: "hidden", cursor: "pointer" }}>
                  <img src={product.image} alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.target.style.display = "none"; }} />
                </div>

                {/* Info */}
                <div style={{ padding: "9px 10px 10px" }}>
                  <p onClick={() => navigate(`/product-details/local-${product.id}`)}
                    style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", margin: "0 0 2px", lineHeight: 1.3, cursor: "pointer", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {product.name}
                  </p>
                  {product.weight && <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 7px" }}>{product.weight}</p>}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>₹{product.price}</span>
                      {product.oldPrice && <span style={{ fontSize: 10, color: "#94a3b8", textDecoration: "line-through", marginLeft: 3 }}>₹{product.oldPrice}</span>}
                    </div>
                    {qty > 0 ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#22c55e", borderRadius: 50, padding: "3px 8px" }}>
                        <button onClick={() => decreaseQty(product.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex", padding: 0 }}><FiMinus size={10} /></button>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", minWidth: 12, textAlign: "center" }}>{qty}</span>
                        <button onClick={() => increaseQty(product.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex", padding: 0 }}><FiPlus size={10} /></button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart({ ...product, quantity: 1 })}
                        style={{ width: 26, height: 26, borderRadius: 8, background: "#22c55e", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        <FiPlus size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickPicks;
