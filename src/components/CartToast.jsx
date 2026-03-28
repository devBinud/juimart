import React, { useEffect, useRef, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { FiShoppingCart, FiX } from "react-icons/fi";/**
 * Shows a bottom toast on mobile when an item is added to cart.
 * On desktop the drawer opens as usual — this component does nothing.
 */
const CartToast = () => {
  const cart = useCartStore((s) => s.cart);
  const openCart = useCartStore((s) => s.openCart);

  const [toast, setToast] = useState(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const prevLengthRef = useRef(cart.length);
  const prevTotalRef = useRef(cart.reduce((s, i) => s + i.quantity, 0));

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const currentTotal = cart.reduce((s, i) => s + i.quantity, 0);
    const added = currentTotal > prevTotalRef.current;
    prevTotalRef.current = currentTotal;
    prevLengthRef.current = cart.length;

    if (!added || cart.length === 0) return;

    // Find the last added/incremented item
    const lastItem = cart[cart.length - 1];
    setToast({ name: lastItem.name, image: lastItem.image, price: lastItem.price });
    setVisible(true);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 3000);
  }, [cart]);

  if (!toast || !visible) return null;

  return (
    <>
      <style>{`
        @keyframes toastUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
      <div style={{
        position: "fixed", bottom: 16, left: 16, right: 16,
        background: "#0f172a",
        borderRadius: 16,
        padding: "12px 14px",
        display: "flex", alignItems: "center", gap: 12,
        zIndex: 99999,
        animation: "toastUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        fontFamily: "'Outfit', sans-serif",
        maxWidth: 480,
        margin: "0 auto",
      }}>
        {/* Product image */}
        <img src={toast.image} alt={toast.name}
          style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover", flexShrink: 0, background: "#1e293b" }}
          onError={e => { e.target.style.display = "none"; }} />

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Added to cart ✓
          </p>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {toast.name} · ₹{toast.price}
          </p>
        </div>

        {/* View cart */}
        <button
          onClick={() => { setVisible(false); openCart(); }}
          style={{
            padding: "7px 12px", background: "#22c55e", color: "#fff",
            border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
          }}>
          <FiShoppingCart size={12} />
          Cart
        </button>

        {/* Dismiss */}
        <button onClick={() => setVisible(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", padding: 0, flexShrink: 0 }}>
          <FiX size={15} />
        </button>
      </div>
    </>
  );
};

export default CartToast;
