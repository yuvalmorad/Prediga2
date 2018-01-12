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

function pushAllSubscriptionsToSpecificUser(user, pushObj) {
    pushObj.url = pushObj.url || "/";
	if (user) {
		console.log("before sending push notifications for all devices of user: ", user.userId);
		const pushSubscriptions = user.pushSubscriptions;
		(pushSubscriptions || []).forEach(function (pushSubscription) {
            console.log("sending push notification with text: ", pushObj);
			webpush.sendNotification(pushSubscription, JSON.stringify(pushObj)).catch(function (err) {
				console.log("error sending push notification", err);
			});
		});
	}
}

const self = module.exports = {
	pushToAllRegisterdUsers: function (pushObj) {
		pushSubscription.find({}).then(function (users) {
			(users || []).forEach(function (user) {
				pushAllSubscriptionsToSpecificUser(user, pushObj);
			});
		});
	},

	pushToSpecificUser: function (userId, pushObj) {
		pushSubscription.findOne({userId: userId}).then(function (user) {
			pushAllSubscriptionsToSpecificUser(user, pushObj);
		});
	},

	pushWithSubscription: function (user, pushObj) {
		pushAllSubscriptionsToSpecificUser(user, pushObj);
	}
};

