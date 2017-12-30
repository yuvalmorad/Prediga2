const PushSubscription = require('../models/pushSubscription');
const pushNotificationUtil = require('./pushNotification');
const matchService = require("../services/matchService");
const schedule = require('node-schedule');
const MatchPrediction = require('../models/matchPrediction');

function scheduleJobBeforeGameKickoffTime() {
	matchService.getNextMatchDate().then(function (match) {
		if (!match) {
			//no more matches
			return;
		}

		const hourBeforeGameKickoffTime = new Date(match.kickofftime);
		hourBeforeGameKickoffTime.setHours(hourBeforeGameKickoffTime.getHours() - 1);
		console.log("schedule runAutomaticPushBeforeGame for: ", hourBeforeGameKickoffTime.toString());
		schedule.scheduleJob(hourBeforeGameKickoffTime, function () {
			PushSubscription.find({}).then(function (users) {
				(users || []).forEach(function (user) {
					MatchPrediction.findOne({matchId: match._id, userId: user.userId}).then(function (matchPrediction) {
						if (!matchPrediction) {
							//user didn't fill a match prediction -> push notification for reminder
                            console.log("sending push notification about not filling prediction for user: ", this.userId);
							pushNotificationUtil.pushWithSubscription(this, "Please fill your prediction, the game is about to start!!!");
						}
					}.bind(user));
				});
			});

			//call schedule again for the next match
			scheduleJobBeforeGameKickoffTime();
		});
	});
}

const self = module.exports = {
	runAutomaticPushBeforeGame: function () {
		scheduleJobBeforeGameKickoffTime();
	}
};