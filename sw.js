// Service worker — cleans up old caches only
// App requires internet (Google Sheets) so no offline caching needed
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// No fetch handler — let browser handle all requests normally
