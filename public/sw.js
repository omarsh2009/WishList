// WishList Pro Tracker — Service Worker
// Caches the app shell for reliable offline access.
// localStorage persistence is untouched — this only handles network assets.

const CACHE_NAME = 'wishlist-pro-v1';

// App shell assets to pre-cache on install
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install: pre-cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  // Activate immediately without waiting for old clients to close
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all open pages immediately
  self.clients.claim();
});

// Fetch: network-first for navigations, stale-while-revalidate for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests (form posts, etc.)
  if (request.method !== 'GET') return;

  // Skip chrome-extension, data URIs, and external origins
  if (!request.url.startsWith(self.location.origin)) return;

  // Navigation requests — network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the latest navigation response
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/');
          });
        })
    );
    return;
  }

  // Static assets — stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          // Only cache successful same-origin responses
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
