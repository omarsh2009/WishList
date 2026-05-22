// WishList Pro Tracker — Service Worker
// Resilient, true offline app-shell caching strategy.
// Keeps Zustand localStorage persistence intact.

const CACHE_NAME = 'wishlist-pro-v2';

// Core assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core app shell');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Resilient network fetch helper with custom timeout to solve "lie-fi" hangs
function fetchWithTimeout(request, timeoutMs = 1500) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Network request timed out'));
    }, timeoutMs);

    fetch(request).then(
      (response) => {
        clearTimeout(timeoutId);
        resolve(response);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
}

// Fetch Interceptor
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Only handle same-origin or typical static asset assets (like unsplash stock photos)
  const isSameOrigin = request.url.startsWith(self.location.origin);
  const isNextAsset = request.url.includes('_next/static');
  const isImageUrl = request.url.match(/\.(png|jpg|jpeg|gif|svg|webp)/i) || request.url.includes('images.unsplash.com');

  if (!isSameOrigin && !isNextAsset && !isImageUrl) return;

  // 1. Navigation / HTML Document requests
  if (request.mode === 'navigate') {
    event.respondWith(
      // Try to load from network first with a short timeout to prevent "lie-fi" hangs
      fetchWithTimeout(request, 1500)
        .then((response) => {
          // Cache successful response
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline or slow network — fallback immediately to the cached main app shell
          return caches.match('/').then((cachedResponse) => {
            return cachedResponse || caches.match(request);
          });
        })
    );
    return;
  }

  // 2. Static CSS, JS, Chunks, Fonts, and Images — Cache-First Strategy
  // Since Next.js assets are hash-versioned, it is safe to serve them from cache first.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return immediately from cache, but fetch in the background to keep it fresh (Stale-While-Revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => { /* ignore background fetch failures when offline */ });
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback placeholder for missing image assets offline
          if (isImageUrl) {
            return caches.match('/icon-192x192.png');
          }
          return null;
        });
    })
  );
});
