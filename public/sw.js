/**
 * Service Worker TitanFit - PWA Offline & Caching Engine (v4)
 * Atende aos requisitos de instalação imediata no Android/iOS (PWA Standalone)
 * Com estratégia Network-First para documentos HTML evitando retenção de versões antigas
 */

const CACHE_NAME = 'titanfit-cache-v4';
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

// Instalação do Service Worker e ativação imediata
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of STATIC_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          // Ativo ignorado no precache, será buscado via rede sob demanda
        }
      }
    })
  );
});

// Ativação e limpeza forçada de caches legados
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Comunicação para comandos de atualização forçada
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data && event.data.action === 'clearCache') {
    caches.keys().then((keys) => {
      Promise.all(keys.map((k) => caches.delete(k)));
    });
  }
});

// Estratégia de requisição
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Não intercepta chamadas de API do servidor
  if (url.pathname.startsWith('/api/')) return;

  // 1. NAVEGAÇÃO E PÁGINAS HTML: NETWORK-FIRST (Sempre busca a versão mais recente primeiro)
  const isNavigation = event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html');
  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Se estiver 100% offline sem internet, aí sim usa o cache local
          return caches.match('/index.html').then((cached) => cached || caches.match('/'));
        })
    );
    return;
  }

  // 2. IMAGENS E GIFS: CACHE-FIRST com fallback rápido para rede
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
        }).catch(() => null);
      })
    );
    return;
  }

  // 3. DEMAIS ARQUIVOS (JS/CSS versionados pelo Vite): Network first com fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
