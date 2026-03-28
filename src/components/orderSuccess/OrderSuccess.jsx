import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const order = JSON.parse(localStorage.getItem("latest-order"));
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  const paymentLabel = order?.paymentMethod === "online" ? "Online (UPI)" : "Cash on Delivery";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 50%, #f8fafc 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px 16px",
      fontFamily: "'Outfit', sans-serif",
    }}>
      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 50; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes confetti {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-60px) rotate(360deg); opacity: 0; }
        }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 420,
        background: "#fff", borderRadius: 24,
        padding: "32px 24px 28px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        textAlign: "center",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.4s ease",
      }}>

        {/* Animated check circle */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "0 8px 24px rgba(34,197,94,0.35)",
          animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
        }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <polyline points="8,18 15,25 28,11"
              stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="50" strokeDashoffset="0"
              style={{ animation: "checkDraw 0.4s ease 0.5s both" }} />
          </svg>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 22, fontWeight: 800, color: "#0f172a",
          margin: "0 0 8px", letterSpacing: "-0.4px",
          animation: "slideUp 0.4s ease 0.3s both",
        }}>
          Order Placed! 🎉
        </h2>
        <p style={{
          fontSize: 14, color: "#64748b", margin: "0 0 24px", lineHeight: 1.6,
          animation: "slideUp 0.4s ease 0.4s both",
        }}>
          Thank you! Your order is confirmed and will be delivered soon.
        </p>

        {/* Info cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
          marginBottom: 24,
          animation: "slideUp 0.4s ease 0.5s both",
        }}>
          {[
            { icon: "⚡", label: "Delivery", value: "15–20 Min" },
            { icon: "💳", label: "Payment", value: paymentLabel },
            order?.id && { icon: "🧾", label: "Order ID", value: `#${order.id.slice(-8)}` },
            order?.total && { icon: "💰", label: "Total", value: `₹${order.total}` },
          ].filter(Boolean).map(({ icon, label, value }) => (
            <div key={label} style={{
              background: "#f8fafc", borderRadius: 14,
              padding: "12px 10px", border: "1px solid #f1f5f9",
            }}>
              <p style={{ fontSize: 18, margin: "0 0 4px" }}>{icon}</p>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 2px" }}>{label}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Items summary */}
        {order?.items && order.items.length > 0 && (
          <div style={{
            background: "#f8fafc", borderRadius: 14, padding: "12px 14px",
            marginBottom: 24, textAlign: "left",
            animation: "slideUp 0.4s ease 0.6s both",
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 10px" }}>Items Ordered</p>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#374151", marginBottom: 5 }}>
                <span>{item.name} ×{item.quantity}</span>
                <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
              <span>Total</span>
              <span style={{ color: "#22c55e" }}>₹{order.total}</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 10,
          animation: "slideUp 0.4s ease 0.7s both",
        }}>
          <button onClick={() => navigate("/")} style={{
            width: "100%", padding: "14px",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "#fff", border: "none", borderRadius: 14,
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
          }}>
            🏠 Back to Home
          </button>
          <button onClick={() => navigate("/receipt")} style={{
            width: "100%", padding: "13px",
            background: "#f8fafc", color: "#374151",
            border: "1.5px solid #e2e8f0", borderRadius: 14,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
          }}>
            📄 View Receipt
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
