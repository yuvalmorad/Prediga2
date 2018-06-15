const util = require('../utils/util.js');
const webpush = require('web-push');
const PushSubscription = require('../models/pushSubscription');
const userSettingsService = require('../services/userSettingsService');

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

const self = module.exports = {
    pushAllSubscriptionsToSpecificUser: function (pushSubscriptionObj, pushObj) {
        pushObj.url = pushObj.url || "/group/" + util.WORLD_CUP_GROUP + "/matchPredictions"; //navigate to world cup group - remove when not needed!
        if (pushSubscriptionObj) {
            //console.log("before sending push notifications for all devices of user: ", user.userId);
            const pushSubscriptions = pushSubscriptionObj.pushSubscriptions;
            (pushSubscriptions || []).forEach(function (pushSubscription) {
                //console.log("sending push notification with text: ", pushObj);
                webpush.sendNotification(pushSubscription, JSON.stringify(pushObj)).catch(function (err) {
                    console.log("error sending push notification", err);
                });
            });
            return Promise.resolve({});
        } else {
            return Promise.resolve({});
        }
    },
    pushToAllRegiseredUsers: function (pushObj) {
        return userSettingsService.getPushUsers().then(function (userIdArr) {
            return PushSubscription.find({userId: {$in: userIdArr}}).then(function (pushSubscriptions) {
                (pushSubscriptions || []).forEach(function (pushSubscription) {
                    self.pushAllSubscriptionsToSpecificUser(pushSubscription, pushObj);
                });
                return Promise.resolve({});
            });
        });
    },

    pushToSpecificUser: function (userId, pushObj) {
        return PushSubscription.findOne({userId: userId}).then(function (user) {
            return self.pushAllSubscriptionsToSpecificUser(user, pushObj);
        });
    },

    pushWithSubscription: function (user, pushObj) {
        return self.pushAllSubscriptionsToSpecificUser(user, pushObj);
    },
    subscribeUserToPushNotification: function (userId, pushObj) {
        return PushSubscription.findOne({userId: userId.toString()}).then(function (pushSubscription) {
            if (pushSubscription) {
                return PushSubscription.findOneAndUpdate({userId: userId.toString()}, {
                    userId: userId, $addToSet: {pushSubscriptions: pushObj}
                }, util.updateSettings);
            } else {
                return PushSubscription.findOneAndUpdate({userId: userId.toString()}, {
                    userId: userId, pushSubscriptions: [pushObj]
                }, util.updateSettings);
            }
        });
    },
    byUserId: function (userId) {
        return PushSubscription.find({userId: userId.toString()});
    },
    byUserIds: function (userIds) {
        return PushSubscription.find({userId: {$in: userIds}});
    },
    all: function () {
        return PushSubscription.find({});
    },
    removeAllByUser: function (userId) {
        return PushSubscription.remove({userId: userId}).then(function (err) {
            return Promise.resolve();
        });
    },
    removeAll: function () {
        return PushSubscription.remove({});
    }
};