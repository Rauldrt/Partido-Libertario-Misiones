// Basic Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalado');
  // Skip waiting is necessary to ensure the new service worker activates immediately.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activado');
  // Claiming clients immediately ensures the new service worker controls the page on activation.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Por ahora, solo pasamos las solicitudes a la red.
  // Más adelante, aquí se pueden añadir estrategias de caché.
  event.respondWith(fetch(event.request));
});
