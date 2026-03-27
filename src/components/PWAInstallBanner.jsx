import React, { useState, useEffect } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import logo from "../assets/logo.png";

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) &&
  !window.matchMedia("(display-mode: standalone)").matches;

const isInStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

const PWAInstallBanner = () => {
  const { canInstall, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOS, setShowIOS] = useState(false);

  useEffect(() => {
    // Show iOS banner after 3s if not already installed and not dismissed
    if (isIOS() && !isInStandaloneMode()) {
      const alreadyDismissed = sessionStorage.getItem("pwa-ios-dismissed");
      if (!alreadyDismissed) {
        const t = setTimeout(() => setShowIOS(true), 3000);
        return () => clearTimeout(t);
      }
    }
  }, []);

  const dismissIOS = () => {
    setShowIOS(false);
    sessionStorage.setItem("pwa-ios-dismissed", "1");
  };

  // ── iOS banner ──
  if (showIOS) {
    return (
      <>
        <style>{`
          @keyframes bannerSlideUp {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#fff",
          borderTop: "1px solid #e2e8f0",
          borderRadius: "20px 20px 0 0",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
          padding: "20px 20px 32px",
          zIndex: 99999,
          animation: "bannerSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
          fontFamily: "'Outfit', sans-serif",
        }}>
          {/* drag handle */}
          <div style={{ width: 40, height: 4, background: "#e2e8f0", borderRadius: 4, margin: "0 auto 16px" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <img src={logo} alt="JuiMart" style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 2px" }}>Install JuiMart</p>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Add to your Home Screen for the best experience</p>
            </div>
            <button onClick={dismissIOS} style={{ marginLeft: "auto", background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 13, color: "#64748b", fontFamily: "'Outfit', sans-serif", flexShrink: 0 }}>✕</button>
          </div>

          {/* Steps */}
          <div style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 16px", border: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px" }}>How to install</p>
            {[
              { step: "1", icon: "⬆️", text: "Tap the Share button at the bottom of Safari" },
              { step: "2", icon: "➕", text: 'Scroll down and tap "Add to Home Screen"' },
              { step: "3", icon: "✅", text: 'Tap "Add" — done! Open JuiMart like any app' },
            ].map(({ step, icon, text }) => (
              <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "#22c55e", color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{step}</div>
                <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.5 }}>{icon} {text}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ── Android / Desktop banner ──
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
