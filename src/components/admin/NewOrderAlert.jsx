import React, { useEffect, useRef, useState } from "react";

/**
 * Plays a continuous siren (two-tone wail) using Web Audio API.
 * Returns a stop function.
 */
function startSiren() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    gain.gain.value = 0.35;

    const sweep = () => {
      const now = ctx.currentTime;
      osc.frequency.cancelScheduledValues(now);
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(1100, now + 0.6);
      osc.frequency.linearRampToValueAtTime(600, now + 1.2);
    };
    sweep();
    const iv = setInterval(sweep, 1200);
    osc.start();

    let stopped = false;
    return () => {
      if (stopped) return;
      stopped = true;
      clearInterval(iv);
      try { osc.stop(); } catch (_) {}
      try { ctx.close(); } catch (_) {}
    };
  } catch (_) {
    return () => {};
  }
}

/**
 * NewOrderAlert
 * Props:
 *   orders  — array of new order objects to display
 *   onDismiss — called when admin clicks "Got it"
 */
const NewOrderAlert = ({ orders, onDismiss }) => {
  const stopSirenRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (orders.length === 0) return;
    stopSirenRef.current = startSiren();
    return () => {
      stopSirenRef.current?.();
      stopSirenRef.current = null;
    };
  }, [orders.length]);

  const handleMute = () => {
    stopSirenRef.current?.();
    stopSirenRef.current = null;
    setMuted(true);
  };

  const handleDismiss = () => {
    stopSirenRef.current?.();
    stopSirenRef.current = null;
    onDismiss();
  };

  if (orders.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes borderSpin {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes alertSlideDown {
          from { opacity: 0; transform: translateY(-32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes alertPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50%       { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
        }
        @keyframes iconBounce {
          0%, 100% { transform: scale(1); }
          40%       { transform: scale(1.25); }
          60%       { transform: scale(0.95); }
        }
        .new-order-alert-wrap {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 99999;
          width: min(520px, calc(100vw - 32px));
          animation: alertSlideDown 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        /* Animated gradient border via padding trick */
        .new-order-border {
          padding: 3px;
          border-radius: 22px;
          background: linear-gradient(270deg, #22c55e, #86efac, #16a34a, #4ade80, #22c55e);
          background-size: 400% 400%;
          animation: borderSpin 2s linear infinite, alertPulse 1.5s ease-in-out infinite;
        }
        .new-order-inner {
          background: #fff;
          border-radius: 20px;
          padding: 22px 24px 20px;
          font-family: 'Outfit', sans-serif;
        }
        .new-order-icon {
          font-size: 36px;
          animation: iconBounce 1s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>

      {/* Backdrop blur */}
      <div style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)",
        backdropFilter: "blur(3px)", zIndex: 99998,
      }} onClick={handleDismiss} />

      <div className="new-order-alert-wrap">
        <div className="new-order-border">
          <div className="new-order-inner">

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
              <span className="new-order-icon">🛒</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 2px", letterSpacing: "-0.4px" }}>
                  New Order{orders.length > 1 ? `s (${orders.length})` : ""}!
                </p>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  {orders.length === 1
                    ? "A new order just came in — review it now."
                    : `${orders.length} new orders are waiting for your attention.`}
                </p>
              </div>
              {/* Mute button */}
              {!muted && (
                <button onClick={handleMute} title="Mute siren" style={{
                  background: "#f1f5f9", border: "none", borderRadius: 8,
                  padding: "6px 10px", cursor: "pointer", fontSize: 16,
                  color: "#64748b", fontFamily: "'Outfit', sans-serif",
                  flexShrink: 0,
                }}>🔇</button>
              )}
            </div>

            {/* Order list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              {orders.map((order) => (
                <div key={order.firebaseKey || order.id} style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 14,
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>
                      {order.customer?.name || "Customer"}
                    </p>
                    <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                      {order.id} · {order.paymentMethod === "cod" ? "💵 COD" : "💳 Online"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 18, fontWeight: 800, color: "#22c55e", margin: "0 0 2px" }}>
                      ₹{order.total}
                    </p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
                      {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleDismiss}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >
                ✅ Got it — Review Orders
              </button>
              {!muted && (
                <button
                  onClick={handleMute}
                  style={{
                    padding: "12px 16px",
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  🔇 Mute
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default NewOrderAlert;
