const CACHE_NAME = 'toeic-vocab-cache-v1';
const ASSETS_TO_CACHE = [
  './toeic_vocab.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 安裝時，先把網站需要的檔案存進快取
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// 啟用時，清掉舊版本的快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 有網路就用網路上最新版本，沒網路就用快取（離線也能開）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
