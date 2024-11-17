// Routes.js - Módulo de rutas
var express = require('express');
var router = express.Router();



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
  messages.push({ _id: id, message, user });

  console.log(messages)
  res.json({
    ok: true,
    message,
    user,
  });
});



module.exports = router;