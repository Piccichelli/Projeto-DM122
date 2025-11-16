const CACHE_NAME = 'pwa-finance-v1';
const urlsToCache = [
    '/',
    '/pwa/pages/index.html',
    '/pwa/pages/gastos.html',
    '/pwa/src/Home/home.js',
    '/pwa/src/Gastos/gastos.js',
    '/pwa/src/Gastos/gastosService.js',
    '/pwa/src/Gastos/gastosHtmlService.js',
    '/pwa/assets/tailwind.js',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
];

// Instalando o SW e adicionando ao cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Ativando SW e limpando caches antigos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) return caches.delete(name);
                })
            )
        )
    );
});

// Interceptando requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
