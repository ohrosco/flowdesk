const CACHE = "flowdesk-v1";
const STATIC_ASSETS = [
  "/",
  "/book",
  "/dashboard",
  "/manifest.json",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
];

// Install — cache known assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first for API, cache first for static
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // API calls — network only, no cache
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Static assets — cache first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((res) => {
        // Cache successful responses
        if (res.ok && res.type === "basic") {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        }
        return res;
      });
    }).catch(() => {
      // Offline fallback — show cached pages
      return caches.match("/");
    })
  );
});
