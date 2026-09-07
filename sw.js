// Nama cache untuk fail aplikasi anda
const CACHE_NAME = 'pwa-pemantauan-v1';

// Senarai fail yang perlu disimpan di dalam cache
const urlsToCache = [
  'index.html',
  'manifest.json',
  'icon-512.png'
];

// 1. Proses INSTALL: Membuka cache dan menyimpan fail-fail teras
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka. Menyimpan fail teras...');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Proses ACTIVATE: Membuang cache versi lama (jika ada kemas kini)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Memadam cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Proses FETCH: Memintas permintaan rangkaian
// Ia akan mencari fail di dalam cache terlebih dahulu. Jika tiada, ia akan memuat turun dari internet.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Pulangkan fail dari cache jika ada
        if (response) {
          return response;
        }
        // Jika tiada di dalam cache, teruskan mengambil dari rangkaian
        return fetch(event.request);
      })
  );
});
