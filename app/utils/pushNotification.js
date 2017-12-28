const webpush = require('web-push');
const pushSubscription = require('../models/pushSubscription');

const vapidKeys = {
    publicKey: "BI75psBX1HkM6jpcXdEYKNV41ZZdzQU_pJf7sS_1V6r3mE-83ptsqjZ7pIVT9sfHc4ThRgc_YAnaS3XSE-igB98",
    privateKey: "y3EXBZQx5zcICy6vDEBjYWkos3HqKvNvt-AoPp8Upnc"
};

webpush.setVapidDetails(
    'mailto:shacharw6@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

function pushAllSubscriptionsToSpecificUser(user, text) {
    if (user) {
        const pushSubscriptions = user.pushSubscriptions;
        pushSubscriptions.forEach(function(pushSubscription){
            webpush.sendNotification(pushSubscription, text);
        });
    }
}

let self = module.exports = {
    pushToAllRegisterdUsers: function(text) {
        pushSubscription.find({}).then(function(users){
            (users || []).forEach(function(user){
                pushAllSubscriptionsToSpecificUser(user, text);
            });
        });
    },

    pushToSpecificUser: function(userId, text) {
        pushSubscription.findOne({userId: userId}).then(function(user){
            pushAllSubscriptionsToSpecificUser(user, text);
        });
    }
};

