const url = window.location.href;
const API_URL = `${window.location.origin}/api/`;
let swLocation = '/twittor-pwa/sw.js';
let swReg;

if (navigator.serviceWorker) {
  if (url.includes('localhost')) {
    swLocation = '/sw.js';
  }

  navigator.serviceWorker.register(swLocation);

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swLocation).then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        swReg = reg;
        swReg.pushManager.getSubscription().then(verifySubscription);
      });
    });
  });
}

// Referencias de jQuery
var googleMapKey = 'AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8';

// Google Maps llaves alternativas - desarrollo
// AIzaSyDyJPPlnIMOLp20Ef1LlTong8rYdTnaTXM
// AIzaSyDzbQ_553v-n8QNs2aafN9QaZbByTyM7gQ
// AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8
// AIzaSyCroCERuudf2z02rCrVa6DTkeeneQuq8TA
// AIzaSyBkDYSVRVtQ6P2mf2Xrq0VBjps8GEcWsLU
// AIzaSyAu2rb0mobiznVJnJd6bVb5Bn2WsuXP2QI
// AIzaSyAZ7zantyAHnuNFtheMlJY1VvkRBEjvw9Y
// AIzaSyDSPDpkFznGgzzBSsYvTq_sj0T0QCHRgwM
// AIzaSyD4YFaT5DvwhhhqMpDP2pBInoG8BTzA9JY
// AIzaSyAbPC1F9pWeD70Ny8PHcjguPffSLhT-YF8

// Referencias de jQuery
var titulo = $('#titulo');
var nuevoBtn = $('#nuevo-btn');
var salirBtn = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn = $('#post-btn');
var avatarSel = $('#seleccion');
var timeline = $('#timeline');

var modal = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns = $('.seleccion-avatar');
var txtMensaje = $('#txtMensaje');

var btnActivadas = $('.btn-noti-activadas');
var btnDesactivadas = $('.btn-noti-desactivadas');

var btnLocation = $('#location-btn');

var modalMapa = $('.modal-mapa');

var btnTomarFoto = $('#tomar-foto-btn');
var btnPhoto = $('#photo-btn');
var contenedorCamara = $('.camara-contenedor');

var lat = null;
var lng = null;
var foto = null;

// El usuario, contiene el ID del héroe seleccionado
var usuario;

// Ininit camera
const camera = new Camera(document.querySelector('#player'));

// ===== Codigo de la aplicación

function crearMensajeHTML(mensaje, personaje, lat, lng, foto) {

  var content = `
    <li class="animated fadeIn fast"
        data-mensaje="${mensaje}"
        data-user="${personaje}"
        data-tipo="mensaje">


        <div class="avatar">
            <img src="img/avatars/${personaje}.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${personaje}</h3>
                <br/>
                ${mensaje}
                `;

  if (foto) {
    content += `
                <br>
                <img class="foto-mensaje" src="${foto}">
        `;
  }

  content += `</div>        
                <div class="arrow"></div>
            </div>
        </li>
    `;


  // si existe la latitud y longitud, 
  // llamamos la funcion para crear el mapa
  if (lat) {
    crearMensajeMapa(lat, lng, personaje);
  }

  // Borramos la latitud y longitud por si las usó
  lat = null;
  lng = null;

  $('.modal-mapa').remove();

  timeline.prepend(content);
  cancelarBtn.click();

}

function crearMensajeMapa(lat, lng, personaje) {


  let content = `
    <li class="animated fadeIn fast"
        data-tipo="mapa"
        data-user="${personaje}"
        data-lat="${lat}"
        data-lng="${lng}">
                <div class="avatar">
                    <img src="img/avatars/${personaje}.jpg">
                </div>
                <div class="bubble-container">
                    <div class="bubble">
                        <iframe
                            width="100%"
                            height="250"
                            frameborder="0" style="border:0"
                            src="https://www.google.com/maps/embed/v1/view?key=${googleMapKey}&center=${lat},${lng}&zoom=17" allowfullscreen>
                            </iframe>
                    </div>
                    
                    <div class="arrow"></div>
                </div>
            </li> 
    `;

  timeline.prepend(content);
}

// Globals
function logIn(ingreso) {

  if (ingreso) {
    nuevoBtn.removeClass('oculto');
    salirBtn.removeClass('oculto');
    timeline.removeClass('oculto');
    avatarSel.addClass('oculto');
    modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
  } else {
    nuevoBtn.addClass('oculto');
    salirBtn.addClass('oculto');
    timeline.addClass('oculto');
    avatarSel.removeClass('oculto');

    titulo.text('Seleccione Personaje');

  }

}


// Seleccion de personaje
avatarBtns.on('click', function () {

  usuario = $(this).data('user');

  titulo.text('@' + usuario);

  logIn(true);

});

// Boton de salir
salirBtn.on('click', function () {

  logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function () {

  modal.removeClass('oculto');
  modal.animate({
    marginTop: '-=1000px',
    opacity: 1
  }, 200);

});

// Boton de cancelar mensaje
cancelarBtn.on('click', function () {
  if (!modal.hasClass('oculto')) {
    modal.animate({
      marginTop: '+=1000px',
      opacity: 0
    }, 200, function () {
      modal.addClass('oculto');
      txtMensaje.val('');
    });
  }
});

// Boton de enviar mensaje
postBtn.on('click', function () {

  var message = txtMensaje.val();
  if (message.length === 0) {
    cancelarBtn.click();
    return;
  }

  postMessage(message, usuario, lat, lng, foto);
  crearMensajeHTML(message, usuario, lat, lng, foto);
});


// Post messages to server
function postMessage(message, user, lat, lng, foto) {

  fetch('api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, user, lat, lng, foto })
  })
    .then(res => res.json())
    .then(data => {
      console.log('Mensaje guardado', data);
    })
    .catch(err => {
      console.log('Error en envio', err);
    });
}

// Get messages from server
function getMessages() {
  fetch('api')
    .then(res => res.json())
    .then(posts => {
      posts.forEach(post => {
        crearMensajeHTML(post.message, post.user, post.lat, post.lng, post.foto);
      });
    });
}

getMessages();

window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);

function isOnline() {
  if (navigator.onLine) {
    $.mdtoast('Online', {
      interaction: true,
      interactionTimeout: 1000,
      actionText: 'Ok!',
      type: 'success'
    });
  } else {
    $.mdtoast('Offline', {
      interaction: true,
      actionText: 'Ok!',
      type: 'warning'
    });
  }
}

// Notifications
function verifySubscription(areActivated) {
  if (areActivated) {
    btnActivadas.removeClass('oculto');
    btnDesactivadas.addClass('oculto');
  } else {
    btnActivadas.addClass('oculto');
    btnDesactivadas.removeClass('oculto');
  }
}

function sendNotification() {
  const notificationOpts = {
    body: 'This is the body of the notification',
    icon: 'img/icons/icon-72x72.png'
  };

  const n = new Notification('Hello World', notificationOpts);

  n.onclick = () => {
    console.log('Click');
  }
}


function notify() {
  if (!window.Notification) {
    console.log('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    sendNotification();
  } else if (Notification.permission !== 'denied' || Notification.permission === 'default') {
    Notification.requestPermission(function (permission) {
      console.log(permission);
      if (permission === 'granted') {
        sendNotification();
      }
    });
  }
}

// notify();

// Get Key
function getPublicKey() {
  return fetch('api/key')
    .then(res => res.arrayBuffer())
    .then(key => new Uint8Array(key));
}

btnDesactivadas.on('click', function () {
  if (!swReg) return console.log('No hay registro de SW');

  getPublicKey().then(key => {
    swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: key,
    })
      .then(res => res.toJSON())
      .then(subscription => {
        console.log(subscription)
        fetch('api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        })
          .then(verifySubscription)
          .catch(cancelSubscription);
      });
  });
});

function cancelSubscription() {
  swReg.pushManager.getSubscription().then(sub => {
    sub.unsubscribe().then(() => verifySubscription(false));
  });
}

btnActivadas.on('click', function () {
  cancelSubscription();
});




// Section 11 - Native Device Features

function createMapModal(lat, lng) {

  $('.modal-mapa').remove();

  var content = `
            <div class="modal-mapa">
                <iframe
                    width="100%"
                    height="250"
                    frameborder="0"
                    src="https://www.google.com/maps/embed/v1/view?key=${googleMapKey}&center=${lat},${lng}&zoom=17" allowfullscreen>
                    </iframe>
            </div>
    `;

  modal.append(content);
}

// Get Geolocation
btnLocation.on('click', () => {

  $.mdtoast('Loading map...', {
    interaction: true,
    interactionTimeout: 1000,
    actionText: 'Ok!'
  });

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position)
      createMapModal(position.coords.latitude, position.coords.longitude);

      lat = position.coords.latitude;
      lng = position.coords.longitude;
    });
  }

});



// Boton de la camara
// usamos la funcion de fleca para prevenir
// que jQuery me cambie el valor del this
btnPhoto.on('click', () => {

  contenedorCamara.removeClass('oculto');
  camera.turnOn();
});


// Boton para tomar la foto
btnTomarFoto.on('click', () => {

  foto = camera.takePhoto();

  camera.turnOff();

});


// Share API
if (navigator.share) {
  console.log('Soporta Share API');
}

timeline.on('click', 'li', function () {
  let tipo = $(this).data('tipo');
  let lat = $(this).data('lat');
  let lng = $(this).data('lng');
  let user = $(this).data('user');
  let mensaje = $(this).data('mensaje');


  const shareOpts = {
    title: user,
    text: mensaje,
  };

  if (tipo === 'mapa') {
    shareOpts.text = 'Mapa';
    shareOpts.url = `https://www.google.com/maps/@${lat},${lng},15z`;
  }

  navigator.share(shareOpts)
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
});