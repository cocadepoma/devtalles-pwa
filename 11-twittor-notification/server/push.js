const vapid = require('./vapid.json');
const URLSafeBase64 = require('urlsafe-base64');

module.exports.getKey = () => {
  return URLSafeBase64.decode(vapid.publicKey);
}