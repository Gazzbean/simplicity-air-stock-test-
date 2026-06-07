// ═══════════════════════════════════════════════════════
//  Service Worker v9
//  Addresses all three Android cache layers
// ═══════════════════════════════════════════════════════
const VERSION = '9';
const CACHE = 'sa-stock-v' + VERSION;

// Install — skip waiting immediately
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activate — delete ALL caches, claim all clients
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch — ALWAYS go to network with cache-busting headers
// Bypasses both SW cache AND browser HTTP cache
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Skip non-GET and cross-origin requests
  if (e.request.method !== 'GET') return;
  if (!url.startsWith(self.location.origin) &&
      !url.includes('sheets.googleapis.com') &&
      !url.includes('script.google.com')) return;

  // For the app files — always fetch fresh, no cache at all
  if (url.includes(self.location.origin)) {
    e.respondWith(
      fetch(e.request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // For API calls — network only, no fallback
  e.respondWith(fetch(e.request));
});
