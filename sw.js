// ═══════════════════════════════════════════════════════
//  Service Worker v8 — Aggressive update strategy
//  Never serves stale content — always network first
// ═══════════════════════════════════════════════════════
const CACHE = 'sa-stock-v8';

// On install — skip waiting immediately so new SW takes over right away
self.addEventListener('install', e => {
  self.skipWaiting();
});

// On activate — claim all clients immediately, delete ALL old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        // Tell all open tabs to reload so they get fresh content
        return self.clients.matchAll({ type: 'window' });
      })
      .then(clients => {
        clients.forEach(client => {
          client.navigate(client.url);
        });
      })
  );
});

// Fetch strategy — ALWAYS go to network, never serve from cache
// This ensures Android always gets the latest version
self.addEventListener('fetch', e => {
  // Only handle same-origin requests
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .catch(() => {
        // Only fall back to cache when truly offline
        return caches.match(e.request);
      })
  );
});
