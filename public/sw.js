// sw.js - Service Worker

const CACHE_NAME = 'pl-misiones-cache-v1';
const urlsToCache = [
  '/',
  '/news',
  '/about',
  '/referentes',
  '/contact',
  '/afiliacion',
  '/fiscalizacion'
];

// Evento de instalación: se dispara cuando el Service Worker se registra.
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache abierto.');
        // Precargamos los URLs principales para que la app cargue offline.
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Falló el precaching de archivos.', error);
      })
  );
});

// Evento de activación: se dispara cuando el Service Worker se activa.
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Eliminamos cachés viejos que no estén en nuestra "whitelist".
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Eliminando caché viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento fetch: intercepta todas las peticiones de red.
self.addEventListener('fetch', event => {
  // Solo respondemos a peticiones GET.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Estrategia: Cache-First.
        // Si la respuesta está en el caché, la devolvemos inmediatamente.
        if (response) {
          return response;
        }

        // Si no está en el caché, la buscamos en la red.
        return fetch(event.request).then(
          networkResponse => {
            // Verificamos si la respuesta es válida.
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clonamos la respuesta para poder guardarla en el caché y devolverla al navegador.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
      .catch(error => {
        console.log('Service Worker: Error en fetch, probablemente offline.', error);
        // Opcional: Podríamos devolver una página de fallback offline aquí.
      })
  );
});
