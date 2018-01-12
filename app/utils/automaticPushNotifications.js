const PushSubscription = require('../models/pushSubscription');
const pushNotificationUtil = require('./pushNotification');
const matchService = require("../services/matchService");
const teamService = require("../services/teamService");
const schedule = require('node-schedule');
const MatchPrediction = require('../models/matchPrediction');
const TeamPrediction = require('../models/teamPrediction');

const self = module.exports = {
	runAutomaticPushBeforeGame: function () {
		self.scheduleJobBeforeGameKickoffTime();
		self.scheduleJobBeforeTeamsKickoffTime();
	},

	scheduleJobBeforeGameKickoffTime: function () {
		matchService.getNextMatchDate().then(function (match) {
			if (!match) {
				//no more matches
				return;
			}

			const hourBeforeGameKickoffTime = new Date(match.kickofftime);
			hourBeforeGameKickoffTime.setHours(hourBeforeGameKickoffTime.getHours() - 1);
			console.log("schedule runAutomaticPushBeforeGame for: ", hourBeforeGameKickoffTime.toString());
			schedule.scheduleJob(hourBeforeGameKickoffTime, function () {
				console.log("hourBeforeGameKickoffTime job started");
				PushSubscription.find({}).then(function (users) {
					if (users) {
						console.log('found:' + users.length + 'users registered to PushSubscription');
						(users || []).forEach(function (user) {
							MatchPrediction.findOne({
								matchId: match._id,
								userId: user.userId
							}).then(function (matchPrediction) {
								if (!matchPrediction) {
									//user didn't fill a match prediction -> push notification for reminder
									console.log("sending push notification about not filling prediction for user: ", this.userId);
									pushNotificationUtil.pushWithSubscription(this, "Please fill your prediction, the game is about to start!!!");
								} else {
									console.log('user:' + user + ' has fill match prediction');
								}

							}.bind(user));
						});
					}
				});

				//call schedule again for the next match
				self.scheduleJobBeforeGameKickoffTime();
			});
		});
	},
	scheduleJobBeforeTeamsKickoffTime: function () {
		teamService.getNextTeamDate().then(function (team) {
			if (!team) {
				//no more teams
				return;
			}

			const hourBeforeGameKickoffTime = new Date(team.deadline);
			hourBeforeGameKickoffTime.setHours(hourBeforeGameKickoffTime.getHours() - 1);
			console.log("schedule runAutomaticPushBeforeGame for: ", hourBeforeGameKickoffTime.toString());
			schedule.scheduleJob(hourBeforeGameKickoffTime, function () {
				console.log("hourBeforeGameKickoffTime job started");
				PushSubscription.find({}).then(function (users) {
					if (users) {
						console.log('found:' + users.length + 'users registered to PushSubscription');
						(users || []).forEach(function (user) {
							TeamPrediction.findOne({
								teamId: team._id,
								userId: user.userId
							}).then(function (teamPrediction) {
								if (!teamPrediction) {
									//user didn't fill a team prediction -> push notification for reminder
									console.log("sending push notification about not filling prediction for user: ", this.userId);
									pushNotificationUtil.pushWithSubscription(this, "Please fill your prediction, the teams prediction is about to end!!!");
								} else {
									console.log('user:' + user + ' has fill team prediction');
								}

							}.bind(user));
						});
					}
				});

				//call schedule again for the next match
				self.scheduleJobBeforeTeamsKickoffTime();
			});
		});
	}
};