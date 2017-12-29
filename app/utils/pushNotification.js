const webpush = require('web-push');
const pushSubscription = require('../models/pushSubscription');

const vapidKeys = {
    publicKey: process.env.WEB_PUSH_PUBLIC_KEY,
    privateKey: process.env.WEB_PUSH_PRIVATE_KEY,
    mailTo: process.env.WEB_PUSH_MAIL_TO
};

webpush.setVapidDetails(
    vapidKeys.mailTo,
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

function pushAllSubscriptionsToSpecificUser(user, text) {
    if (user) {
        const pushSubscriptions = user.pushSubscriptions;
        pushSubscriptions.forEach(function (pushSubscription) {
            webpush.sendNotification(pushSubscription, text).catch(function (err) {
                console.log("error sending push notification", err);
            });
        });
    }
}

const self = module.exports = {
    pushToAllRegisterdUsers: function (text) {
        pushSubscription.find({}).then(function (users) {
            (users || []).forEach(function (user) {
                pushAllSubscriptionsToSpecificUser(user, text);
            });
        });
    },

    pushToSpecificUser: function (userId, text) {
        pushSubscription.findOne({userId: userId}).then(function (user) {
            pushAllSubscriptionsToSpecificUser(user, text);
        });
    },

    pushWithSubscription: function (user, text) {
        pushAllSubscriptionsToSpecificUser(user, text);
    }
};

