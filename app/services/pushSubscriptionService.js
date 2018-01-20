const schedule = require('node-schedule');
const util = require('../utils/util.js');
const webpush = require('web-push');
const PushSubscription = require('../models/pushSubscription');
const matchService = require("../services/matchService");
const teamService = require("../services/teamService");
const matchPredictionsService = require('../services/matchPredictionsService');
const teamPredictionsService = require('../services/teamPredictionsService');
const pushSubscriptionService = require('../services/pushSubscriptionService');

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
	runAutomaticPushBeforeGame: function () {
		self.scheduleJobBeforeGameKickoffTime();
		self.scheduleJobBeforeTeamsKickoffTime();
	},

	scheduleJobBeforeGameKickoffTime: function () {
		return matchService.getFirstGameToStartByDate(new Date()).then(function (match) {
			if (!match) {
				return Promise.resolve({});
			}

			const hourBeforeGameKickoffTime = new Date(match.kickofftime);
			hourBeforeGameKickoffTime.setHours(hourBeforeGameKickoffTime.getHours() - 1);
			//console.log("schedule runAutomaticPushBeforeGame for: ", hourBeforeGameKickoffTime.toString());

			schedule.scheduleJob(hourBeforeGameKickoffTime, function () {
				//console.log("hourBeforeGameKickoffTime job started");
				self.all().then(function (subscriptions) {
					if (subscriptions) {
						//console.log('found:' + users.length + 'users registered to PushSubscription');
						(subscriptions || []).forEach(function (subscription) {
							matchPredictionsService.byMatchIdUserId(match._id, subscription.userId).then(function (matchPrediction) {
								if (!matchPrediction) {
									//user didn't fill a match prediction -> push notification for reminder
									//console.log("sending push notification about not filling prediction for user: ", this.userId);
									pushSubscriptionService.pushWithSubscription(subscription, {text: "Please fill your prediction, the game is about to start!!!"});
								}
							});
						});
					}
				});

				//call schedule again for the next match
				self.scheduleJobBeforeGameKickoffTime();
			});
			return Promise.resolve({});
		});
	},
	scheduleJobBeforeTeamsKickoffTime: function () {
		return teamService.getNextTeamDate().then(function (team) {
			if (!team) {
				//no more teams
				return Promise.resolve({});
			}

			const hourBeforeGameKickoffTime = new Date(team.deadline);
			hourBeforeGameKickoffTime.setHours(hourBeforeGameKickoffTime.getHours() - 1);
			//console.log("schedule runAutomaticPushBeforeGame for: ", hourBeforeGameKickoffTime.toString());
			schedule.scheduleJob(hourBeforeGameKickoffTime, function () {
				//console.log("hourBeforeGameKickoffTime job started");
				self.all().then(function (subcriptions) {
					if (subcriptions) {
						//console.log('found:' + users.length + 'users registered to PushSubscription');
						(subcriptions || []).forEach(function (subcription) {
							teamPredictionsService.byTeamIdUserId(team._id, subcription.userId).then(function (teamPrediction) {
								if (!teamPrediction) {
									//user didn't fill a team prediction -> push notification for reminder
									//console.log("sending push notification about not filling prediction for user: ", this.userId);
									pushNotificationUtil.pushWithSubscription(subcription, {text: "Please fill your prediction, the teams prediction is about to end!!!"});
								}
							});
						});
					}
				});
				//call schedule again for the next match
				self.scheduleJobBeforeTeamsKickoffTime();
			});
			return Promise.resolve({});
		});
	},
	subscribeUserToPushNotification: function (userId, pushObj) {
		return PushSubscription.findOneAndUpdate({userId: userId}, {
			userId: userId, $addToSet: {pushSubscriptions: pushObj}
		}, util.updateSettings);
	},
	byUserId: function (userId) {
		return PushSubscription.findOne({userId: userId});
	},
	all: function () {
		return PushSubscription.find({});
	}
};