
const CACHE_NAME = 'checkin-go-v23-premium-backgrounds';
// FIX: Caminhos relativos para garantir funcionamento em preview e produção, pré-carregando backgrounds premium para celular/offline
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './styles.css',
  './africa_premium.png',
  './aracaju_capital_premium.png',
  './ba_ass_foz_premium.png',
  './colombia_premium.jpg',
  './colombia_premium.png',
  './foz_ass_ba_premium.png',
  './foz_ba_patagonia_premium.png',
  './foz_ba_premium.jpg',
  './foz_ba_premium.png',
  './foz_premium.png',
  './peru_premium.png',
  './porto_seguro_premium.png',
  './salvador_aracaju_maceio.jpg',
  './salvador_premium.jpg',
  './sp_ssa_aju_premium.png',
  './ssa_aju_premium.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => key !== CACHE_NAME && caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Estratégia Network-First para navegação (index.html) para garantir atualizações 24/7
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok && url.origin === self.location.origin) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback para o cache offline
          return caches.match('./index.html') || caches.match('/');
        })
    );
    return;
  }

  // 2. Estratégia Cache-First com fallback para rede para scripts, estilos e imagens comuns
  if (url.pathname.endsWith('.js') || 
      url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.webp')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok && url.origin === self.location.origin) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
          }
          return networkResponse;
        });
      })
    );
  }
});
