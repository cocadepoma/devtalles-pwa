// imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
  '/',
  'index.html',
  'style/base.css',
  'js/app.js',
  'js/sw-utils.js',
  'js/base.js',
];

const APP_SHELL_INMUTABLE = [
  'js/pouchdb-nightly.js',
];

self.addEventListener('install', (e) => {
  const cacheStatic = caches.open(STATIC_CACHE).then((cache) => {
    cache.addAll(APP_SHELL);
  });

  const cacheInmutable = caches.open(INMUTABLE_CACHE).then((cache) => {
    cache.addAll(APP_SHELL_INMUTABLE);
  });

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', (e) => {
  const respuesta = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes('static')) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(respuesta);
});

self.addEventListener('fetch', (e) => {
  if(e.request.url.startsWith('chrome-extension://')) return;

  const resp = caches.match(e.request).then((res) => {
    if (res) {
      return res;
    }

    return fetch(e.request).then((newRes) => {
      return updateDynamicCache(DYNAMIC_CACHE, e.request, newRes);
    });
  });

  e.respondWith(resp);
});