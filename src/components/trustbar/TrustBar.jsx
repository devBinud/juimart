import React from "react";

const PERKS = [
  { icon: "⚡", title: "20 Min Delivery", sub: "To your door",  color: "#fefce8", border: "#fde047", text: "#854d0e" },
  { icon: "🌿", title: "100% Fresh",      sub: "Farm to table", color: "#f0fdf4", border: "#86efac", text: "#15803d" },
  { icon: "💰", title: "Best Prices",     sub: "No hidden fees",color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
  { icon: "🔒", title: "Safe Pay",        sub: "UPI & COD",     color: "#f5f3ff", border: "#c4b5fd", text: "#6d28d9" },
];

const TrustBar = () => (
  <div style={{ maxWidth: 1200, margin: "16px auto 0", padding: "0 16px", fontFamily: "'Outfit', sans-serif" }}>
    <style>{`
      .trust-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
      @media(max-width: 600px) { .trust-grid { grid-template-columns: repeat(2,1fr); } }
    `}</style>
    <div className="trust-grid">
      {PERKS.map(p => (
        <div key={p.title} style={{
          background: p.color, border: `1.5px solid ${p.border}`,
          borderRadius: 14, padding: "12px 12px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{p.icon}</span>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: p.text, margin: 0, lineHeight: 1.2 }}>{p.title}</p>
            <p style={{ fontSize: 10, color: "#64748b", margin: 0 }}>{p.sub}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TrustBar;
