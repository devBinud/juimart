import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const order = JSON.parse(localStorage.getItem("latest-order"));
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  const paymentLabel =
    order?.paymentMethod === "online"
      ? "Online (UPI)"
      : "Cash on Delivery";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 50%, #f8fafc 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 50; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 20,
          padding: "28px 20px",
          boxShadow: "0 15px 50px rgba(0,0,0,0.08)",
          textAlign: "center",
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.4s ease",
        }}
      >
        {/* Check Icon */}
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
            animation: "popIn 0.5s ease",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 36 36">
            <polyline
              points="8,18 15,25 28,11"
              stroke="#fff"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="50"
              style={{ animation: "checkDraw 0.4s ease 0.4s both" }}
            />
          </svg>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            marginBottom: 6,
            color: "#0f172a",
          }}
        >
          Order Placed! 🎉
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: 14,
            color: "#64748b",
            marginBottom: 10,
            lineHeight: 1.5,
          }}
        >
          Thank you! Your order is confirmed and will be delivered soon.
        </p>

        {/* 🔥 NEW CONTACT LINE */}
        <p
          style={{
            fontSize: 13,
            color: "#475569",
            marginBottom: 20,
            background: "#f1f5f9",
            padding: "10px 12px",
            borderRadius: 10,
            lineHeight: 1.4,
          }}
        >
          📞 Need help? Contact our delivery partner at{" "}
          <a
            href="tel:8638240878"
            style={{
              color: "#16a34a",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            +91 8638240878
          </a>{" "}
          for live updates or assistance.
        </p>

        {/* Info Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {[
            { icon: "⚡", label: "Delivery", value: "15–20 Min" },
            { icon: "💳", label: "Payment", value: paymentLabel },
            order?.id && {
              icon: "🧾",
              label: "Order ID",
              value: `#${order.id.slice(-8)}`,
            },
            order?.total && {
              icon: "💰",
              label: "Total",
              value: `₹${order.total}`,
            },
          ]
            .filter(Boolean)
            .map(({ icon, label, value }) => (
              <div
                key={label}
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: "10px",
                }}
              >
                <div style={{ fontSize: 16 }}>{icon}</div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#94a3b8",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "14px",
              background: "#22c55e",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            🏠 Back to Home
          </button>

          <button
            onClick={() => navigate("/receipt")}
            style={{
              padding: "13px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            📄 View Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
