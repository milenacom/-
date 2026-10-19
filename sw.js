const CACHE_NAME = 'rpp-app-v1';

// Установка Service Worker
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Установлен');
});

// Перехват запросов (для офлайн-работы)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
