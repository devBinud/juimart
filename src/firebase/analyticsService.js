import { getDatabase, ref, push, onValue, query, orderByChild, limitToLast } from "firebase/database";

/* ── Detect device info ── */
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  const platform = navigator.platform || "";

  // Device type
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
  const deviceType = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop";

  // OS
  let os = "Unknown";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Mac/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  // Browser
  let browser = "Unknown";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\//i.test(ua)) browser = "Opera";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Safari/i.test(ua)) browser = "Safari";

  // Screen
  const screen = `${window.screen.width}×${window.screen.height}`;
  const language = navigator.language || "en";

  return { deviceType, os, browser, screen, language };
};

/* ── Log a page visit ── */
export const logVisit = async (page = "/") => {
  try {
    const db = getDatabase();
    const info = getDeviceInfo();
    await push(ref(db, "analytics/visits"), {
      page,
      ...info,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString("en-IN"),
      hour: new Date().getHours(),
    });
  } catch (e) {
    // silently fail — never break the app
  }
};

/* ── Listen to recent visits (last 500) ── */
export const listenVisits = (cb) => {
  const db = getDatabase();
  const q = query(ref(db, "analytics/visits"), orderByChild("timestamp"), limitToLast(500));
  return onValue(q, (snap) => {
    const data = snap.val();
    if (!data) return cb([]);
    const list = Object.entries(data)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.timestamp - a.timestamp);
    cb(list);
  });
};
