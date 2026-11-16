const CACHE_NAME = 'telo-rpp-v7';
const APP_CACHE_PREFIX = 'telo-rpp-';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon.png'
];

// Сохраняем основные файлы приложения при установке новой версии.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Удаляем только старые кэши этого приложения, не затрагивая другие
// проекты, которые могут находиться на том же домене.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(APP_CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Для страниц сначала пробуем сеть, а при отсутствии интернета
// показываем сохранённый index.html. Остальные файлы берём из кэша.
self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedPage = await caches.match('./index.html');
        return cachedPage || new Response(
          'Страница пока недоступна офлайн. Подключитесь к интернету и откройте приложение ещё раз.',
          {
            status: 503,
            statusText: 'Offline',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          }
        );
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request);
    })
  );
});
