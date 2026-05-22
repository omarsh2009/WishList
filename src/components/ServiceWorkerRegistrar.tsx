'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register after the page has fully loaded for best performance
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            console.log('[SW] Service worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('[SW] Service worker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
}
