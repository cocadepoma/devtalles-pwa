// const CACHE_NAME = 'cache-v1';

const CACHE_STATIC_NAME = 'static-v2';
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
      '/js/app.js'
    ]);
  });

    const promiseInmutable = caches
      .open(CACHE_INMUTABLE_NAME)
      .then((cache) => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'));

  event.waitUntil(Promise.all([promise, promiseInmutable]));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 1 - Cache Only
  // event.respondWith(caches.match(request));

  // Block requests to Chrome Extensions
  if(request.url.startsWith('chrome-extension://')) return;
  
  // 2 - Cache with Network Fallback
  // const resp = caches.match(request)
  //   .then(resp => {
  //     if (resp) return resp;

  //     return fetch(request)
  //       .then(newResp => {
          
  //         caches.open(CACHE_DYNAMIC_NAME).then(cache => {
  //           cache.put(request, newResp);
  //           cleanCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
  //         });

  //         return newResp.clone();
  //       });
  //   });

  // event.respondWith(resp);


  // 3 - Network with Cache Fallback
  // const resp = fetch(request)
  //   .then(newResp => {
  //     if (!newResp) return caches.match(request);

  //     caches.open(CACHE_DYNAMIC_NAME)
  //       .then(cache => {
  //         cache.put(request, newResp);
  //         cleanCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
  //       });

  //     return newResp.clone();
  //   })
  //   .catch(err => {
  //     return caches.match(request);
  //   });

  // event.respondWith(resp);

  // 4 - Cache with Network Update
  // When perfomance is critical

  // if(request.url.includes('bootstrap')) {
  //   return event.respondWith(caches.match(request));
  // }

  // const resp = caches.open(CACHE_STATIC_NAME).then(cache => {
  //   fetch(request).then(newResp => cache.put(request, newResp));
  //   return cache.match(request);
  // });

  // event.respondWith(resp);

  // 5 - Cache & Network Race
  const resp = new Promise((resolve, reject) => {
    let rejected = false;

    const failed = (err) => {
      if (rejected) {
        if (/\.(png|jpg)$/i.test(request.url)) {
          resolve(caches.match('/img/noimg.jpg'));
        } else {
          reject(err);
        }
      } else {
        rejected = true;
      }
    };

    fetch(request).then(res => {
      res.ok ? resolve(res) : failed();
    }).catch(failed);

    caches.match(request).then(res => {
      res ? resolve(res) : failed();
    }).catch(failed);
  });

  event.respondWith(resp);
});
