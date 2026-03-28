import React, { useEffect, useRef, useState, useCallback } from "react";

/* ── Continuous siren ── */
function startSiren() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    gain.gain.value = 0.3;

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
 * NewOrderAlert — unified alert for:
 *   - New incoming orders (COD or Online)
 *   - Pending payment verifications (online, awaiting admin action)
 *
 * Props:
 *   orders      — new order objects (brand new arrivals)
 *   pendingPay  — orders with paymentStatus === 'pending_verification'
 *   onDismiss   — dismiss the new-order alert
 *   onVerify    — (firebaseKey, patch) => void
 */
const NewOrderAlert = ({ orders = [], pendingPay = [], onDismiss, onVerify }) => {
  const stopSirenRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [tab, setTab] = useState("new"); // "new" | "pending"

  const hasNew     = orders.length > 0;
  const hasPending = pendingPay.length > 0;
  const show       = hasNew || hasPending;

  // Start/stop siren
  useEffect(() => {
    if (!show) return;
    if (!muted) {
      stopSirenRef.current = startSiren();
    }
    return () => {
      stopSirenRef.current?.();
      stopSirenRef.current = null;
    };
  }, [show, muted]);

  // Auto-switch tab
  useEffect(() => {
    if (hasNew) setTab("new");
    else if (hasPending) setTab("pending");
  }, [hasNew, hasPending]);

  const stopSiren = useCallback(() => {
    stopSirenRef.current?.();
    stopSirenRef.current = null;
    setMuted(true);
  }, []);

  const handleDismiss = () => {
    stopSiren();
    onDismiss?.();
  };

  if (!show) return null;

  const isCODOnly = orders.length === 1 && orders[0]?.paymentMethod === "cod";
  const borderGradient = hasPending && tab === "pending"
    ? "linear-gradient(270deg,#f59e0b,#fcd34d,#d97706,#fbbf24,#f59e0b)"
    : isCODOnly
      ? "linear-gradient(270deg,#3b82f6,#93c5fd,#1d4ed8,#60a5fa,#3b82f6)"
      : "linear-gradient(270deg,#22c55e,#86efac,#16a34a,#4ade80,#22c55e)";

  return (
    <>
      <style>{`
        @keyframes borderSpin {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes alertSlideDown {
          from { opacity: 0; transform: translateY(-24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes alertPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50%      { box-shadow: 0 0 0 10px rgba(34,197,94,0); }
        }
        @keyframes iconBounce {
          0%,100% { transform: scale(1); }
          40%      { transform: scale(1.2); }
          60%      { transform: scale(0.95); }
        }
        .noa-wrap {
          position: fixed;
          top: 12px;
          left: 12px;
          right: 12px;
          z-index: 99999;
          max-width: 480px;
          margin: 0 auto;
          animation: alertSlideDown 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .noa-border {
          padding: 3px;
          border-radius: 20px;
          background-size: 400% 400%;
          animation: borderSpin 1.8s linear infinite, alertPulse 1.5s ease-in-out infinite;
        }
        .noa-inner {
          background: #fff;
          border-radius: 18px;
          padding: 16px 16px 14px;
          font-family: 'Outfit', sans-serif;
        }
        .noa-icon { font-size: 30px; animation: iconBounce 1s ease-in-out infinite; display: inline-block; }
        .noa-tab { padding: 6px 14px; border-radius: 50px; border: none; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.15s; }
      `}</style>

      {/* Backdrop */}
      <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.5)", backdropFilter:"blur(3px)", zIndex:99998 }} onClick={handleDismiss} />

      <div className="noa-wrap">
        <div className="noa-border" style={{ background: borderGradient }}>
          <div className="noa-inner">

            {/* Header row */}
            <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:14 }}>
              <span className="noa-icon">
                {tab === "pending" ? "⏳" : isCODOnly ? "💵" : "🛒"}
              </span>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:17, fontWeight:800, color:"#0f172a", margin:"0 0 2px", letterSpacing:"-0.3px" }}>
                  {tab === "pending"
                    ? `${pendingPay.length} Payment${pendingPay.length>1?"s":""} Awaiting Verification`
                    : orders.length > 1
                      ? `${orders.length} New Orders!`
                      : isCODOnly ? "New COD Order!" : "New Online Order!"
                  }
                </p>
                <p style={{ fontSize:12, color:"#64748b", margin:0 }}>
                  {tab === "pending"
                    ? "Siren plays until you verify or reject."
                    : "New order just arrived — act now."}
                </p>
              </div>
              {!muted && (
                <button onClick={stopSiren} title="Mute" style={{ background:"#f1f5f9", border:"none", borderRadius:8, padding:"5px 8px", cursor:"pointer", fontSize:14, color:"#64748b", flexShrink:0 }}>🔇</button>
              )}
            </div>

            {/* Tabs — only show if both exist */}
            {hasNew && hasPending && (
              <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                <button className="noa-tab" onClick={() => setTab("new")}
                  style={{ background:tab==="new"?"#22c55e":"#f1f5f9", color:tab==="new"?"#fff":"#64748b" }}>
                  🛒 New ({orders.length})
                </button>
                <button className="noa-tab" onClick={() => setTab("pending")}
                  style={{ background:tab==="pending"?"#f59e0b":"#f1f5f9", color:tab==="pending"?"#fff":"#64748b" }}>
                  ⏳ Pending ({pendingPay.length})
                </button>
              </div>
            )}

            {/* Order cards */}
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14, maxHeight:260, overflowY:"auto" }}>
              {(tab === "new" ? orders : pendingPay).map((order) => {
                const isCOD = order.paymentMethod === "cod";
                const isPending = tab === "pending";
                return (
                  <div key={order.firebaseKey || order.id} style={{
                    background: isPending ? "#fffbeb" : isCOD ? "#eff6ff" : "#f0fdf4",
                    border: `1.5px solid ${isPending ? "#fcd34d" : isCOD ? "#bfdbfe" : "#86efac"}`,
                    borderRadius:12, padding:"12px 14px",
                  }}>
                    {/* Top row: name + badge + amount */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7, minWidth:0 }}>
                        <p style={{ fontSize:14, fontWeight:800, color:"#0f172a", margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:160 }}>
                          {order.customer?.name || "Customer"}
                        </p>
                        <span style={{ fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:50, flexShrink:0,
                          background: isPending?"#f59e0b":isCOD?"#1d4ed8":"#15803d", color:"#fff" }}>
                          {isPending ? "⏳ Pending" : isCOD ? "💵 COD" : "💳 Online"}
                        </span>
                      </div>
                      <p style={{ fontSize:17, fontWeight:800, color: isPending?"#d97706":isCOD?"#1d4ed8":"#22c55e", margin:0, flexShrink:0 }}>
                        ₹{order.total}
                      </p>
                    </div>

                    {/* Details */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3px 12px", marginBottom: isPending ? 10 : 0 }}>
                      {order.customer?.phone && (
                        <p style={{ fontSize:11, color:"#64748b", margin:0 }}>📞 {order.customer.phone}</p>
                      )}
                      <p style={{ fontSize:11, color:"#64748b", margin:0 }}>
                        🛒 {order.items?.length} item{order.items?.length!==1?"s":""}
                      </p>
                      {order.customer?.address && (
                        <p style={{ fontSize:11, color:"#64748b", margin:0, gridColumn:"1/-1",
                          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          📍 {order.customer.address}
                        </p>
                      )}
                      {order.items && order.items.length > 0 && (
                        <p style={{ fontSize:11, color:"#374151", margin:0, gridColumn:"1/-1",
                          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          {order.items.map(i => `${i.name} ×${i.quantity}`).join(", ")}
                        </p>
                      )}
                    </div>

                    {/* Verify/Reject for pending */}
                    {isPending && (
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={() => onVerify?.(order.firebaseKey, {paymentStatus:"verified",orderStatus:"confirmed"})}
                          style={{ flex:1, padding:"7px", background:"#f0fdf4", border:"1.5px solid #86efac", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", color:"#15803d", fontFamily:"'Outfit',sans-serif" }}>
                          ✅ Verify
                        </button>
                        <button onClick={() => onVerify?.(order.firebaseKey, {paymentStatus:"rejected",orderStatus:"cancelled"})}
                          style={{ flex:1, padding:"7px", background:"#fef2f2", border:"1.5px solid #fecaca", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", color:"#dc2626", fontFamily:"'Outfit',sans-serif" }}>
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={handleDismiss} style={{
                flex:1, padding:"11px",
                background: tab==="pending"
                  ? "linear-gradient(135deg,#f59e0b,#d97706)"
                  : isCODOnly
                    ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                    : "linear-gradient(135deg,#22c55e,#16a34a)",
                color:"#fff", border:"none", borderRadius:11,
                fontSize:13, fontWeight:700, cursor:"pointer",
                fontFamily:"'Outfit',sans-serif",
                boxShadow: tab==="pending" ? "0 4px 12px rgba(245,158,11,0.35)" : "0 4px 12px rgba(34,197,94,0.35)",
              }}>
                ✅ Got it — Review Orders
              </button>
              {!muted && (
                <button onClick={stopSiren} style={{ padding:"11px 14px", background:"#f1f5f9", color:"#475569", border:"none", borderRadius:11, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>
                  🔇
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
