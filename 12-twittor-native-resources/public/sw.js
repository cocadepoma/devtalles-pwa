// imports
importScripts('js/libs/dexie.js');
importScripts('js/sw-db.js');
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v2';

const APP_SHELL = [
  // '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
  'js/sw-utils.js',
  'js/sw-db.js',
  'js/libs/mdtoast.min.js',
  'js/libs/mdtoast.min.css',
];

const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'css/animate.css',
  'js/libs/font-awesome.css',
  'js/libs/jquery.js',
  'js/libs/dexie.js',
];

self.addEventListener('install', (e) => {
  const cacheStatic = caches.open(STATIC_CACHE).then((cache) => {
    cache.addAll(APP_SHELL);
  });

  const cacheInmutable = caches.open(INMUTABLE_CACHE).then((cache) => {
    cache.addAll(APP_SHELL_INMUTABLE);
  });

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  const respuesta = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes('static')) {
        return caches.delete(key);
      }

      if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(respuesta);
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.startsWith('chrome-extension://')) return;
  let resp;

  if (e.request.url.includes('/api')) {
    resp = handleApiMessages(DYNAMIC_CACHE, e.request);
  } else {
    resp = caches.match(e.request).then((res) => {
      if (res) {
        updateStaticCache(STATIC_CACHE, e.request, APP_SHELL_INMUTABLE);
        return res;
      }

      return fetch(e.request).then((newRes) => {
        return updateDynamicCache(DYNAMIC_CACHE, e.request, newRes);
      });
    });
  }

  e.respondWith(resp);
});

self.addEventListener('sync', (e) => {
  console.log('SW: Sync', e);
  if (e.tag === 'new-message') {

    const resp = postMessages();
    e.waitUntil(resp);
  }
});

self.addEventListener('push', (e) => {
  console.log('SW: Push', e);

  const data = JSON.parse(e.data.text());

  console.log(`img/avatars/${data.user}.jpg`)
  const options = {
    body: data.message,
    icon: 'img/icons/icon-72x72.png',
    // icons: `img/avatars/${data.user}.jpg`, // Not working
    badge: 'img/favicon.ico',
    image: 'https://i.pinimg.com/736x/17/16/52/1716522196a7253ce3bfc268441eaa03.jpg',
    vibrate: [125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600],
    openUrl: '/',
    data: {
      url: '/',
      id: data.user,
    },
    actions: [
      {
        action: 'thor-action',
        title: 'Thor',
        icon: 'img/avatars/thor.jpg',
      },
      {
        action: 'ironman-action',
        title: 'Ironman',
        icon: 'img/avatars/ironman.jpg',
      },
    ],
  };

  e.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclose', (e) => {
  console.log('Notification closed', e);
});

self.addEventListener('notificationclick', (e) => {
  const notification = e.notification;

  const resp = clients.matchAll().then((cls) => {
    const client = cls.find((c) => c.visibilityState === 'visible' || c.visibilityState === 'hidden');

    if (client !== undefined) {
      client.navigate(notification.data.url);
      client.focus();
    } else {
      clients.openWindow(notification.data.url);
    }

    return notification.close();
  });
  e.waitUntil(resp);
});