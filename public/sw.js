const CACHE_NAME = "zui-quick-mart-v2";
const SHELL = ["/", "/index.html", "/manifest.json", "/favicon.ico", "/logo192.png", "/logo512.png"];

// Install
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(SHELL).catch(() => {}))
  );
  self.skipWaiting();
});

// Activate — purge old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, cache fallback
// iOS Safari fix: only cache same-origin GET requests with basic/default response type
self.addEventListener("fetch", (e) => {
  const req = e.request;

  // Only handle GET, same-origin, non-chrome-extension
  if (req.method !== "GET") return;
  if (!req.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        // iOS Safari: only cache opaque-safe responses
        if (res && res.status === 200 && res.type === "basic") {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || caches.match("/index.html"))
      )
  );
});

// Push notifications (Android Chrome + desktop; iOS 16.4+ in standalone)
self.addEventListener("push", (e) => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || "zui-quick-mart", {
      body: data.body || "You have a new update!",
      icon: "/logo192.png",
      badge: "/logo192.png",
      vibrate: [200, 100, 200],
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || "/"));
});
