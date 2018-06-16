const schedule = require('node-schedule');
const utils = require("../utils/util");
const matchService = require("../services/matchService");
const groupService = require("../services/groupService");
const userSettingsService = require('../services/userSettingsService');
const matchPredictionsService = require('../services/matchPredictionsService');
const pushSubscriptionService = require('../services/pushSubscriptionService');

const self = module.exports = {

    run: function () {
        self.scheduleJobBeforeGameKickoffTime(0);

        // For testing only to generate random + push
        /*self.iterateUserSettings({
            "_id": "5a21a7c1a3f89181074e977b",
            "league": "4a21a7c1a3f89181074e9762"
        });*/
    },
    callPushNotifications: function (userId, groupObj) {
        return pushSubscriptionService.byUserId(userId).then(function (subscriptions) {
            if (!subscriptions) {
                return Promise.resolve();
            }
            const promises = subscriptions.map(function (subscription) {
                return pushSubscriptionService.pushWithSubscription(subscription, {
                    url: "/group/"+groupObj._id.toString()+"/matchPredictions",
                    text: "You didn't fill match prediction in group "+ groupObj.name+" , the match about to start in 1 hour, click to predict."});
            });
            return Promise.all(promises);
        });
    },
    // main method
    scheduleJobBeforeGameKickoffTime: function (min) {
        return matchService.getNextMatch(60 + min).then(function (match) {
            if (!match) {
                return Promise.resolve({});
            }

            const hourBeforeGameKickoffTime = new Date(match.kickofftime);
            hourBeforeGameKickoffTime.setHours(hourBeforeGameKickoffTime.getHours() - 1);
            //console.log("[Match Scheduler] -  next job will start at " + hourBeforeGameKickoffTime.toString());
            schedule.scheduleJob(hourBeforeGameKickoffTime, function () {
                matchService.getMatchesOneHourBeforeStart().then(function (matches) {
                    //console.log("[Match Scheduler] - checking random and push for " + matches.length + " matches");
                    matches.forEach(function (match) {
                        self.iterateUserSettings(match);
                    });
                });
                self.scheduleJobBeforeGameKickoffTime(2);
            });
            return Promise.resolve({});
        });
    },
    iterateUserSettings: function (match) {
        //console.log("[scheduled Job 1 hour BeforeGameKickoffTime] -  job started for " + match._id);

        // get relevant groups with the league of the match
        groupService.byLeagueId(match.league).then(function (relevantGroups) {
            if (!relevantGroups || relevantGroups.length < 1) {
                return Promise.resolve();
            }
            userSettingsService.getPushUsers().then(function (userAgreedToReceivePushNotifications) {
                // iterating all groups (w/o everyone)
                const promises = relevantGroups.map(function (relevantGroup) {
                    if (relevantGroup._id.toString() === utils.DEFAULT_GROUP) {
                        return Promise.resolve();
                    }
                    // get group users.
                    const userInGroupPromises = relevantGroup.users.map(function (userInGroup) {
                        // is user fill prediction in the group?
                        return matchPredictionsService.byMatchIdUserIdGroupId(match._id.toString(), userInGroup, relevantGroup._id.toString()).then(function (matchPrediction) {
                            if (!matchPrediction) {
                                // create random
                                return matchPredictionsService.createRandomPrediction(match._id.toString(), userInGroup, relevantGroup._id.toString()).then(function () {
                                    // If part of push list -> call Push.
                                    if (userAgreedToReceivePushNotifications && userAgreedToReceivePushNotifications.indexOf(userInGroup) > 0) {
                                        self.callPushNotifications(userInGroup, relevantGroup);
                                    } else {
                                        return Promise.resolve();
                                    }
                                });
                            } else {
                                return Promise.resolve();
                            }
                        });
                    });

                    return Promise.all(userInGroupPromises);
                });
                return Promise.all(promises);
            });
        });
    }
};