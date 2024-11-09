const CACHE_STATIC_NAME = 'static-v5';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

const CACHE_DYNAMIC_LIMIT = 50;

function cleanCache( cacheName, sizeItems ){
  caches.open(cacheName)
    .then(cache => {
      cache.keys()
        .then(keys => {
          if (keys.length > sizeItems) {
            cache.delete(keys[0])
              .then(cleanCache(cacheName, sizeItems));
          }
        });
    });
}


self.addEventListener('install', (event) =>{
  const promise = caches.open(CACHE_STATIC_NAME).then((cache) => {
    return cache.addAll([
      '/',
      '/index.html',
      '/css/style.css',
      '/img/main.jpg',
      '/img/noimg.jpg',
      '/js/app.js',
      '/pages/offline.html',
    ]);
  });

    const promiseInmutable = caches
      .open(CACHE_INMUTABLE_NAME)
      .then((cache) => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'));

  event.waitUntil(Promise.all([promise, promiseInmutable]));
});

self.addEventListener('activate', (event) => {
  const resp = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== CACHE_STATIC_NAME && key.includes('static')) {
        return caches.delete(key);
      }
    });
  });

  event.waitUntil(resp);
});

self.addEventListener('fetch', (event) => {  
  const request = event.request;

  if(request.url.startsWith('chrome-extension://')) return;
  // 2 - Cache with Network Fallback
  const resp = caches.match(request)
    .then(resp => {
      if (resp) return resp;

      return fetch(request)
        .then(newResp => {
          console.log(newResp);
          caches.open(CACHE_DYNAMIC_NAME).then(cache => {
            cache.put(request, newResp);
            cleanCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
          });

          return newResp.clone();
        })
        .catch(() => {
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/pages/offline.html');
          }
        });
    });

  event.respondWith(resp);

});
