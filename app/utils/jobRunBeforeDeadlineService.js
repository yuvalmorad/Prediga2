const schedule = require('node-schedule');
const utils = require("../utils/util");
const matchService = require("../services/matchService");
const teamService = require("../services/teamService");
const groupService = require("../services/groupService");
const leagueService = require('../services/leagueService');
const userSettingsService = require("../services/userSettingsService");
const matchPredictionsService = require('../services/matchPredictionsService');
const teamPredictionsService = require('../services/teamPredictionsService');
const pushSubscriptionService = require('../services/pushSubscriptionService');

const self = module.exports = {

	run: function () {
		self.scheduleJobBeforeGameKickoffTime(0);
		self.scheduleJobBeforeTeamsKickoffTime(0);
		//self.iterateUserSettings(0, '4a21a7c1a3f89281175e9344'); // TODO - Testing.
		//self.iterateUserSettings(1, '5a1342399018dfc4e2faf5b4'); // TODO - Testing.
	},
	fulfilRandomTeams: function (teamId, relevantUsers) {
		if (!relevantUsers || relevantUsers.length < 1) {
			return Promise.resolve();
		}
		return teamPredictionsService.getUserIdsWithoutTeamPredictions(teamId, relevantUsers).then(function (usersWithoutPredictions) {
			if (!usersWithoutPredictions || usersWithoutPredictions.length < 1) {
				return Promise.resolve();
			}
			return teamService.byId(teamId).then(function (team) {
				if (!team) {
					return Promise.resolve();
				}
				return leagueService.byId(team.league).then(function (league) {
					if (!league) {
						return Promise.resolve();
					}
					console.log("[Team Scheduler] - generating random team predictions for " + usersWithoutPredictions.length + ' users');
					const promises = usersWithoutPredictions.map(function (userId) {
						return teamPredictionsService.createRandomPrediction(team, userId, league.clubs, utils.DEFAULT_GROUP);
					});
					return Promise.all(promises);
				});
			});
		});
	},
	fulfilCopyTeams: function (teamId, relevantUsers) {
		if (!relevantUsers || relevantUsers.length < 1) {
			return Promise.resolve();
		}

		console.log("[Team Scheduler] - copying team predictions for " + relevantUsers.length + ' users');
		const promises = relevantUsers.map(function (userId) {
			return teamPredictionsService.byTeamIdsUserIdGroupId(teamId, userId, utils.DEFAULT_GROUP).then(function (teamPrediction) {
				if (!teamPrediction) {
					return Promise.resolve();
				}

				return teamService.byId(teamId).then(function (team) {
					if (!team) {
						return Promise.resolve();
					}
					return groupService.byUserId(userId).then(function (groups) {
						if (!groups) {
							return Promise.resolve();
						}
						const promises = groups.map(function (group) {
							if (group._id === utils.DEFAULT_GROUP) {
								return Promise.resolve();
							}
							if (group.leagueIds.indexOf(team.league) === -1) {
								return Promise.resolve();
							}

							return teamPredictionsService.byTeamIdsUserIdGroupId(teamId, userId, group._id).then(function (teamPredictionInGroup) {
								if (teamPredictionInGroup && teamPredictionInGroup.groupId === group._id) {
									// already exist, exit.
									return Promise.resolve();
								}

								let copyPrediction = {
									groupId: group._id,
									teamId: teamId,
									userId: userId,
									team: teamPrediction[0].team
								};
								return teamPredictionsService.updatePrediction(copyPrediction, userId, group._id);
							});
						});
						return Promise.all(promises);
					});
				});
			});
		});

		return Promise.all(promises);
	},
	fulfilPushTeams: function (teamId, relevantUsers) {
		if (!relevantUsers || relevantUsers.length < 1) {
			return Promise.resolve();
		}
		return teamPredictionsService.getUserIdsWithoutTeamPredictions(teamId, relevantUsers).then(function (usersWithoutPredictions) {
			if (!usersWithoutPredictions || usersWithoutPredictions.length < 1) {
				return Promise.resolve();
			}

			return pushSubscriptionService.byUserIds(usersWithoutPredictions).then(function (subscriptions) {
				if (!subscriptions) {
					return Promise.resolve();
				}
				console.log("[Team Scheduler] - push notification for team predictions for " + subscriptions.length + ' users');
				const promises = subscriptions.map(function (subscription) {
					return pushSubscriptionService.pushWithSubscription(subscription, {text: "You didn't fill team's prediction which is about to be close in one hour"});
				});

				return Promise.all(promises);
			});
		});
	},
	fulfilRandomMatches: function (matchId, relevantUsers) {
		if (!relevantUsers || relevantUsers.length < 1) {
			return Promise.resolve();
		}
		return matchPredictionsService.getUserIdsWithoutMatchPredictions(matchId, relevantUsers).then(function (usersWithoutPredictions) {
			if (!usersWithoutPredictions || usersWithoutPredictions.length < 1) {
				return Promise.resolve();
			}
			console.log("[Match Scheduler] - generating random match predictions for " + usersWithoutPredictions.length + ' users');
			const promises = usersWithoutPredictions.map(function (userId) {
				return matchPredictionsService.createRandomPrediction(matchId, userId, utils.WORLD_CUP_GROUP);
			});

			return Promise.all(promises);
		});
	},
	fulfilCopyMatches: function (matchId, relevantUsers) {
		if (!relevantUsers || relevantUsers.length < 1) {
			return Promise.resolve();
		}
		console.log("[Match Scheduler] - copying match predictions for " + relevantUsers.length + ' users');
		const promises = relevantUsers.map(function (userId) {
			return matchPredictionsService.byMatchIdUserIdGroupId(matchId, userId, utils.WORLD_CUP_GROUP).then(function (matchPrediction) {
				if (!matchPrediction) {
					return Promise.resolve();
				}

				return matchService.byId(matchId).then(function (match) {
					if (!match) {
						return Promise.resolve();
					}
					return groupService.byUserId(userId).then(function (groups) {
						if (!groups) {
							return Promise.resolve();
						}
						const promises = groups.map(function (group) {
							if (group._id === utils.WORLD_CUP_GROUP) {
								return Promise.resolve();
							}
							if (group.leagueIds.indexOf(match.league) === -1) {
								return Promise.resolve();
							}
							// checking if we already set a match prediction, then we don't override.
							return matchPredictionsService.byMatchIdUserIdGroupId(matchId, userId, group._id).then(function (matchPredictionInGroup) {
								if (matchPredictionInGroup && (matchPredictionInGroup.groupId === group._id)) {
									// already exist, exit.
									return Promise.resolve();
								}
								let copyPrediction = {
									groupId: group._id,
									matchId: match._id,
									userId: userId,
									winner: matchPrediction.winner,
									team1Goals: matchPrediction.team1Goals,
									team2Goals: matchPrediction.team2Goals,
									goalDiff: matchPrediction.goalDiff,
									firstToScore: matchPrediction.firstToScore
								};

								return matchPredictionsService.updatePrediction(copyPrediction, userId, group._id);
							});
						});
						return Promise.all(promises);
					});
				});
			});
		});

		return Promise.all(promises);
	},
	fulfilPushMatches: function (matchId, relevantUsers) {
		if (!relevantUsers || relevantUsers.length < 1) {
			return Promise.resolve();
		}
		return matchPredictionsService.getUserIdsWithoutMatchPredictions(matchId, relevantUsers).then(function (usersWithoutPredictions) {
			if (!usersWithoutPredictions || usersWithoutPredictions.length < 1) {
				return Promise.resolve();
			}
			return pushSubscriptionService.byUserIds(usersWithoutPredictions).then(function (subscriptions) {
				if (!subscriptions) {
					return Promise.resolve();
				}

				console.log("[Match Scheduler] - push notification for match predictions for " + subscriptions.length + ' users');
				const promises = subscriptions.map(function (subscription) {
					return pushSubscriptionService.pushWithSubscription(subscription, {text: "You didn't fill match prediction which is about to be close in one hour..."});
				});

				return Promise.all(promises);
			});
		});
	},
	scheduleJobBeforeGameKickoffTime: function (min) {
		return matchService.getNextMatch(60 + min).then(function (match) {
			if (!match) {
				return Promise.resolve({});
			}

			const hourBeforeGameKickoffTime = new Date(match.kickofftime);
			hourBeforeGameKickoffTime.setHours(hourBeforeGameKickoffTime.getHours() - 1);
			console.log("[Match Scheduler] -  next job will start at " + hourBeforeGameKickoffTime.toString());
			schedule.scheduleJob(hourBeforeGameKickoffTime, function () {
				matchService.getMatchesOneHourBeforeStart().then(function (matches) {
					console.log("[Match Scheduler] - checking settings for " + matches.length + " matches");
					matches.forEach(function (match) {
						self.iterateUserSettings(0, match._id);
					});
				});
				self.scheduleJobBeforeGameKickoffTime(2);
			});
			return Promise.resolve({});
		});
	},
	scheduleJobBeforeTeamsKickoffTime: function (min) {
		return teamService.getNextTeam(60 + min).then(function (team) {
			if (!team) {
				return Promise.resolve({});
			}

			const hourBeforeGameKickoffTime = new Date(team.deadline);
			hourBeforeGameKickoffTime.setHours(hourBeforeGameKickoffTime.getHours() - 1);
			console.log("[Teams Scheduler] -  next job will start at " + hourBeforeGameKickoffTime.toString());
			schedule.scheduleJob(hourBeforeGameKickoffTime, function () {
				teamService.getTeamsOneHourBeforeStart().then(function (teams) {
					console.log("[Teams Scheduler] - checking settings for " + teams.length + " teams");
					teams.forEach(function (team) {
						self.iterateUserSettings(1, team._id);
					});
				});
				self.scheduleJobBeforeTeamsKickoffTime(2);
			});
			return Promise.resolve({});
		});
	},
	iterateUserSettings: function (typeOfPrediction, gameId) {
		console.log("[Scheduler] -  job started for " + gameId + " and type " + typeOfPrediction);
		userSettingsService.all().then(function (userSettings) {
			if (!userSettings) {
				return;
			}
			let usersWantsToGetPushArray = [];
			let usersWantsRandom = [];
			let usersWantsCopy = [];
			userSettings.forEach(function (userSetting) {
				if (userSetting.value === utils.USER_SETTINGS_VALUES.TRUE) {
					if (userSetting.key === utils.USER_SETTINGS_KEYS.PUSH_NOTIFICATION) {
						usersWantsToGetPushArray.push(userSetting.userId);
					}
					else if (userSetting.key === utils.USER_SETTINGS_KEYS.RANDOM_ALL) {
						usersWantsRandom.push(userSetting.userId);
					}
					else if (userSetting.key === utils.USER_SETTINGS_KEYS.COPY_ALL_GROUPS) {
						usersWantsCopy.push(userSetting.userId);
					}
				}
			});

			if (typeOfPrediction === 0) {
				self.fulfilRandomMatches(gameId, usersWantsRandom).then(function () {
					self.fulfilCopyMatches(gameId, usersWantsCopy).then(function () {
						self.fulfilPushMatches(gameId, usersWantsToGetPushArray);
					});
				});
			} else {
				self.fulfilRandomTeams(gameId, usersWantsRandom).then(function () {
					self.fulfilCopyTeams(gameId, usersWantsCopy).then(function () {
						self.fulfilPushTeams(gameId, usersWantsToGetPushArray);
					})
				});
			}
		});
	}
};