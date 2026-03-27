export function register() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service worker registered:", reg.scope);

          // Check for updates every 60s
          setInterval(() => reg.update(), 60 * 1000);

          reg.onupdatefound = () => {
            const worker = reg.installing;
            if (!worker) return;
            worker.onstatechange = () => {
              if (worker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("[PWA] New version available — reload to update.");
              }
            };
          };
        })
        .catch((err) => console.error("[PWA] Registration failed:", err));
    });
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((reg) => reg.unregister())
      .catch((err) => console.error(err));
  }
}
