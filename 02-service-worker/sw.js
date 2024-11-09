self.addEventListener('fetch', (event) => {

    // if(event.request.url.includes('.jpg')){
      
    //   // let fotoReq = fetch('img/main.jpg');
    //   // let fotoReq = fetch(event.request.url);
    //   let fotoReq = fetch(event.request);
    //   event.respondWith(fotoReq);
    // }
    
    // if(event.request.url.includes('style.css')){
    //   const resp = new Response(`
    //     body {
    //       background-color: red !important;
    //       color: pink;
    //     }
    //   `, {
    //     headers: {
    //       'Content-Type': 'text/css'
    //     }
    //   });

    //   event.respondWith(resp);
    // }

    // if(event.request.url.includes('main.jpg')){
    //   let resp = fetch('img/main-patas-arriba.jpg');
    //   event.respondWith(resp);
    // }

    event.respondWith(
      fetch(event.request)
        .then( resp => {
          if(resp.ok){
            return resp;
          }

          return fetch('img/main-patas-arriba.jpg');
        })
    )
});