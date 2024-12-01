const fs = require('fs');
const vapid = require('./vapid.json');
const URLSafeBase64 = require('urlsafe-base64');

const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:pacors88@gmail.com',
  vapid.publicKey,
  vapid.privateKey,
);

let subscriptions = require('./subscriptions.json');

module.exports.getKey = () => {
  return URLSafeBase64.decode(vapid.publicKey);
};

module.exports.addSubscription = (subscription) => {
  subscriptions.push(subscription);

  fs.writeFileSync(`${__dirname}/subscriptions.json`, JSON.stringify(subscriptions));
};

module.exports.sendPush = (post) => {
  const sentNotfications = [];

  subscriptions.forEach((subscription, i) => {
    const pushProm = webpush.sendNotification(subscription, JSON.stringify(post))
      .catch(err => {
        if (err.statusCode === 410) {
          subscriptions[i].unsubscribe = true;
          fs.writeFileSync(`${__dirname}/subscriptions.json`, JSON.stringify(subscriptions));
        }
      });

    sentNotfications.push(pushProm);
  });

  Promise.all(sentNotfications).then(() => {
    subscriptions = subscriptions.filter(sub => !sub.unsubscribe);
    fs.writeFileSync(`${__dirname}/subscriptions.json`, JSON.stringify(subscriptions));
  });
};