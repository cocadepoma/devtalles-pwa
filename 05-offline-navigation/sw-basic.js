


self.addEventListener('fetch', (event) => {
  // const offlineResp = new Response(`
  //   Welcome to the offline mode.

  //   To use this app you need to be connected to the internet.
  // `);

  // const offlineResp = new Response(`
  //   <!DOCTYPE html>
  //   <html lang="en">
  //   <head>
  //       <meta charset="UTF-8">
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //       <meta http-equiv="X-UA-Compatible" content="ie=edge">
  //       <title>Mi PWA</title>
  //   </head>
  //   <body class="container p-3">
      
  //         <h1>Offline Mode</h1>
      
  //         <p>
  //             To use this app you need to be connected to the internet.
  //         </p>

  //   </body>
  //   </html>
  //   `, {
  //       headers: {
  //         'Content-Type': 'text/html'
  //       }
  //   });

  const offlineResp = fetch('pages/offline.html');

  const resp = fetch(event.request).catch(() => offlineResp);

  event.respondWith(resp);
})