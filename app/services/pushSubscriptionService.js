const util = require('../utils/util.js');
const webpush = require('web-push');
const PushSubscription = require('../models/pushSubscription');

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
	pushAllSubscriptionsToSpecificUser: function (user, pushObj) {
		pushObj.url = pushObj.url || "/";
		if (user) {
			//console.log("before sending push notifications for all devices of user: ", user.userId);
			const pushSubscriptions = user.pushSubscriptions;
			(pushSubscriptions || []).forEach(function (pushSubscription) {
				//console.log("sending push notification with text: ", pushObj);
				webpush.sendNotification(pushSubscription, JSON.stringify(pushObj)).catch(function (err) {
					//console.log("error sending push notification", err);
				});
			});
			return Promise.resolve({});
		} else {
			return Promise.resolve({});
		}
	},
	pushToAllRegisterdUsers: function (pushObj) {
		return PushSubscription.find({}).then(function (users) {
			(users || []).forEach(function (user) {
				self.pushAllSubscriptionsToSpecificUser(user, pushObj);
			});
			return Promise.resolve({});
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
		return PushSubscription.findOneAndUpdate({userId: userId}, {
			userId: userId, $addToSet: {pushSubscriptions: pushObj}
		}, util.updateSettings);
	},
	byUserId: function (userId) {
		return PushSubscription.findOne({userId: userId});
	},
	byUserIds: function (userIds) {
		return PushSubscription.find({userId: {$in: userIds}});
	},
	all: function () {
		return PushSubscription.find({});
	},
	removeAllByUser: function (userId) {
		return PushSubscription.remove({userId: userId});
	},
	removeAll: function () {
		return PushSubscription.remove({});
	}
};