// Bump cache version to force refresh on all devices
const CACHE = 'sa-stock-v5';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Delete ALL old caches immediately
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => {
        if(k !== CACHE) {
          console.log('Deleting old cache:', k);
          return caches.delete(k);
        }
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first — always try to get fresh content
  // Only fall back to cache if offline
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
