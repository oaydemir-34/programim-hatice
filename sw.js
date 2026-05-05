const CACHE = 'programim-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled([
        cache.add(new Request('/programim-hatice/', {mode: 'no-cors'})),
        cache.add(new Request('/programim-hatice/index.html', {mode: 'no-cors'})),
        cache.add(new Request('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Amiri:wght@400;700&display=swap', {mode: 'no-cors'})),
        cache.add(new Request('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js', {mode: 'no-cors'}))
      ])
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return response;
      }).catch(() => {
        if (e.request.destination === 'document') {
          return caches.match('/programim-hatice/index.html');
        }
      });
    })
  );
});
