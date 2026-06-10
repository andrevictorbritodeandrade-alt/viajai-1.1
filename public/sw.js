
const CACHE_NAME = 'checkin-go-v22-svg-icons';
// FIX: Caminhos relativos para garantir funcionamento em preview e produção
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './styles.css'
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

  // Estratégia Cache-First para navegação, scripts e estilos
  if (event.request.mode === 'navigate' || 
      url.pathname.endsWith('.js') || 
      url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.svg')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Retorna o cache IMEDIATAMENTE se existir
        if (cachedResponse) return cachedResponse;

        // Se não estiver no cache, tenta a rede e salva para a próxima
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
          }
          return networkResponse;
        }).catch(() => {
           // Fallback para index.html se estiver offline e navegando
           if (event.request.mode === 'navigate') {
             return caches.match('./index.html');
           }
        });
      })
    );
  }
});
