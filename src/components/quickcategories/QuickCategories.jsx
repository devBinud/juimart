import React from "react";
import { useNavigate } from "react-router-dom";

// category values must match exactly what's stored in Firebase / local products
const CATS = [
  { label: "Fruits & Veggies", emoji: "🥦", category: "Fruits & Vegetables", color: "#f0fdf4", border: "#86efac", text: "#15803d" },
  { label: "Dairy & Eggs",     emoji: "🥛", category: "Dairy & Eggs",         color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
  { label: "Grocery",          emoji: "🛒", category: "Grocery",              color: "#fefce8", border: "#fde047", text: "#854d0e" },
  { label: "Vegetables",       emoji: "🥕", category: "Vegetables",           color: "#f0fdf4", border: "#bbf7d0", text: "#166534" },
  { label: "Snacks",           emoji: "�", category: "Snacks",               color: "#fff7ed", border: "#fdba74", text: "#c2410c" },
  { label: "Beverages",        emoji: "🧃", category: "Beverages",            color: "#f5f3ff", border: "#c4b5fd", text: "#6d28d9" },
  { label: "Bakery",           emoji: "🍞", category: "Bakery",               color: "#fdf4ff", border: "#e879f9", text: "#86198f" },
  { label: "Meat & Fish",      emoji: "🐟", category: "Meat & Fish",          color: "#fff1f2", border: "#fda4af", text: "#be123c" },
  { label: "Frozen",           emoji: "�", category: "Frozen",               color: "#f0f9ff", border: "#7dd3fc", text: "#0369a1" },
  { label: "Personal Care",    emoji: "🧴", category: "Personal Care",        color: "#fdf2f8", border: "#f0abfc", text: "#a21caf" },
];

const QuickCategories = () => {
  const navigate = useNavigate();

  const goToCategory = (category) => {
    navigate(`/all-products?category=${encodeURIComponent(category)}`);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "16px auto 0", padding: "0 16px", fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 18, padding: "18px 0 4px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 18px", marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>Shop by Category</h2>
          <button onClick={() => navigate("/all-products")}
            style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
            See all →
          </button>
        </div>

        {/* Scroll row */}
        <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 18px 16px", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {CATS.map((cat) => (
            <button key={cat.label}
              onClick={() => goToCategory(cat.category)}
              style={{
                flexShrink: 0, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6,
                background: cat.color, border: `1.5px solid ${cat.border}`,
                borderRadius: 14, padding: "12px 10px",
                cursor: "pointer", minWidth: 72, maxWidth: 72,
                transition: "transform 0.18s, box-shadow 0.18s",
                fontFamily: "'Outfit', sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.09)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <span style={{ fontSize: 26, lineHeight: 1 }}>{cat.emoji}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: cat.text, textAlign: "center", lineHeight: 1.3 }}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickCategories;
