/**
 * Service Worker TitanFit - PWA Offline & Caching Engine
 * Atende aos requisitos de instalação imediata no Android/iOS (PWA Standalone)
 */

const CACHE_NAME = 'titanfit-cache-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon.ico',
  '/exercises/smith-squat.gif',
  '/exercises/incline-press.gif',
  '/exercises/lat-pulldown.gif',
  '/exercises/hip-thrust.gif',
  '/exercises/leg-curl.gif',
  '/exercises/bench-press.gif',
  '/exercises/incline-row.gif',
  '/exercises/lateral-raise.gif',
  '/exercises/biceps-curl.gif',
  '/exercises/triceps-press.gif',
  '/exercises/leg-press.gif'
];

// Instalação do Service Worker e precache resiliente dos ativos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of STATIC_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn('[SW] Ativo ignorado no precache (será buscado via rede):', asset);
        }
      }
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches legados
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia de requisição resiliente: Cache First para imagens estáticas, Network First para APIs
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Não intercepta chamadas de API
  if (url.pathname.startsWith('/api/')) return;

  // Para imagens e GIFs de exercícios: Cache First com fallback instantâneo para rede
  if (
    event.request.destination === 'image' ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.jpg')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Para páginas e outros recursos
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
          return null;
        })
      );
    })
  );
});
