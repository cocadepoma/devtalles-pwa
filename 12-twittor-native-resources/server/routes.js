// Routes.js - Módulo de rutas

const express = require('express');
const router = express.Router();
const push = require('./push');

const messages = [
  {
    _id: 'XXX',
    user: 'spiderman',
    message: 'Hey there!',
  },
  {
    _id: 'XXX2',
    user: 'ironman',
    message: 'Hey there! I am the real Ironman',
  },
  {
    _id: 'XXX3',
    user: 'Hulk',
    message: 'Smash!',
  }
];



// Get mensajes
router.get('/', function (req, res) {
  res.json(messages);
});

// Post mensaje
router.post('/', function (req, res) {
  const message = req.body.message;
  const user = req.body.user;

  const id = Math.random().toString(36).substring(7);
  messages.push({ _id: id, message, user, lat: req.body.lat, lng: req.body.lng, foto: req.body.foto });

  res.json({
    ok: true,
    message,
    user,
  });
});

// Keeo the subscription
router.post('/subscribe', (req, res) => {
  const subscription = req.body;

  push.addSubscription(subscription);

  res.json('subscribe');
});

router.get('/key', (req, res) => {
  const key = push.getKey();

  res.send(key);
});

router.post('/push', (req, res) => {
  const post = {
    title: req.body.title,
    message: req.body.message,
    user: req.body.user,
  };

  push.sendPush(post);
  res.json(post);
});

module.exports = router;