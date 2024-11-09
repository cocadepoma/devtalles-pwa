// Lifecycles of a Service Worker

self.addEventListener('install', (event) => {
  // Download assets
  // Create cache
  console.log('SW: Installed!!');
  
  const installation = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('SW: Installed!!');
      self.skipWaiting();
      resolve();
    }, 1);
    
  });
  

  event.waitUntil(installation);
});

// When the service worker is activated and ready to control the page
self.addEventListener('activate', (event) => {
  // Delete old caches
  console.log('SW2: Activated!!');
});


// Fetch: Manage requests from the browser
self.addEventListener('fetch', (event) => {
  // Apply strategies: Cache with network fallback, cache only, network only, etc.
  console.log('SW: Fetching!!', event.request.url);

  if(event.request.url.includes('reqres.in')) {
    const resp = new Response(`{ "ok": false, "message": "jajaja" }`);
    event.respondWith(resp);
  }
});