import React, { useState } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import logo from "../assets/logo.png";

const PWAInstallBanner = () => {
  const { canInstall, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <>
      <style>{`
        @keyframes bannerSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
      <div style={{
        position: "fixed", bottom: 16, left: 16, right: 16,
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
        border: "1.5px solid #e2e8f0",
        padding: "16px 18px",
        display: "flex", alignItems: "center", gap: 14,
        zIndex: 99999,
        animation: "bannerSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        fontFamily: "'Outfit', sans-serif",
        maxWidth: 480,
        margin: "0 auto",
      }}>
        <img src={logo} alt="JuiMart" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", margin: "0 0 2px" }}>Install JuiMart App</p>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Fast, offline-ready & feels native</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={() => setDismissed(true)}
            style={{ padding: "8px 12px", background: "#f1f5f9", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#64748b", fontFamily: "'Outfit', sans-serif" }}>
            Later
          </button>
          <button onClick={install}
            style={{ padding: "8px 16px", background: "linear-gradient(135deg,#22c55e,#16a34a)", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff", fontFamily: "'Outfit', sans-serif", boxShadow: "0 4px 12px rgba(34,197,94,0.35)" }}>
            Install
          </button>
        </div>
      </div>
    </>
  );
};

export default PWAInstallBanner;
