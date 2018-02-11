const TeamPrediction = require('../models/teamPrediction');
const teamService = require('../services/teamService');
const utils = require('../utils/util');

const self = module.exports = {
	createTeamPredictions(groupId, teamPredictions, userId) {
		const promises = teamPredictions.map(function (teamPrediction) {
			return teamService.byIdBeforeDate(teamPrediction.teamId).then(function (team) {
				if (!team) {
					return Promise.reject();
				}
				teamPrediction.userId = userId;
				return TeamPrediction.findOneAndUpdate({
					teamId: teamPrediction.teamId, groupId: groupId, userId: userId
				}, teamPrediction, utils.updateSettings);
			});
		});

		return Promise.all(promises);
	},
	getPredictionsForOtherUsersInner: function (teams, userId, groupId) {
		const promises = teams.map(function (aTeam) {
			return self.byTeamIdUserIdGroupId(aTeam._id, userId, groupId).then(function (teamPrediction) {
				if (teamPrediction) {
					return Promise.resolve(teamPrediction);
				} else {
					return Promise.resolve({});
				}
			})
		});
		return Promise.all(promises);
	},
	getPredictionsForMeInner: function (me, groupId, teamIds) {
		if (typeof(teamIds) === 'undefined') {
			return self.byUserIdGroupId(me, groupId);
		} else {
			return self.byTeamIdsUserIdGroupId(teamIds, me, groupId);
		}
	},
	getPredictionsForOtherUsers: function (predictionRequest) {
		return teamService.getStartedTeams(predictionRequest.teamIds).then(function (teams) {
			return self.getPredictionsForOtherUsersInner(teams, predictionRequest.userId, predictionRequest.groupId).then(function (predictions) {
				let predArr = [];
				predictions.forEach(function (prediction) {
					if (prediction && prediction.length > 0) {
						predArr.push(prediction[0]);
					}
				});
				return Promise.resolve(predArr);
			});
		});
	},
	getPredictionsByUserId: function (predictionRequest) {
		if (predictionRequest.isForMe) {
			return self.getPredictionsForMeInner(predictionRequest.userId, predictionRequest.groupId, predictionRequest.teamIds);
		} else {
			return self.getPredictionsForOtherUsers(predictionRequest).then(function (teamPredictions) {
				return Promise.resolve(teamPredictions);
			});
		}
	},
	removeByGroupId: function (groupId) {
		return TeamPrediction.remove({groupId: groupId});
	},
	removeByGroupIdAndTeamsIds: function (groupId, teamIds) {
		return TeamPrediction.remove({groupId: groupId, teamId: {$in: teamIds}});
	},
	removeByGroupIdAndUserId: function (groupId, userId) {
		return TeamPrediction.remove({groupId: groupId, userId: userId});
	},
	byTeamIdUserIdGroupId: function (teamId, userId, groupId) {
		return TeamPrediction.find({teamId: teamId, userId: userId, groupId: groupId});
	},
	byTeamIdsGroupId: function (teamIds, groupId) {
		return TeamPrediction.find({teamId: {$in: teamIds}, groupId: groupId});
	},
	byGroupIdAndTeams: function (groupId, teams) {
		if (!teams || teams.length < 1) {
			return Promise.resolve([]);
		}
		const teamsIds = teamService.getIdsArr(teams);
		return self.byTeamIdsGroupId(teamsIds, groupId).then(function (predictions) {
			return Promise.resolve(predictions);
		});
	},
	byTeamIdsUserIdGroupId: function (teamIds, userId, groupId) {
		return TeamPrediction.find({
			teamId: {$in: teamIds}, userId: userId, groupId: groupId
		});
	},
	byTeamIdGroupId: function (teamId, groupId) {
		return TeamPrediction.find({teamId: teamId, groupId: groupId});
	},
	byUserIdGroupId: function (userId, groupId) {
		return TeamPrediction.find({userId: userId, groupId: groupId});
	},
	byTeamId: function (teamId) {
		return TeamPrediction.find({teamId: teamId});
	},
	getGroupIdArr: function (teamPredictions) {
		return teamPredictions.map(function (teamPrediction) {
			return teamPrediction.groupId;
		});
	},
	byTeamIdUserId: function (teamId, userId) {
		return TeamPrediction.findOne({teamId: teamId, userId: userId});
	},
	getFutureGamesPredictionsCounters: function (groupId, teamIds) {
		if (!teamIds) {
			return Promise.resolve([]);
		}
		return teamService.getNotStartedTeams(teamIds).then(function (teams) {
			if (!teams) {
				return Promise.resolve([]);
			}
			const relevantTeamIds = teamService.getIdsArr(teams);
			return self.byTeamIdsGroupId(relevantTeamIds, groupId).then(function (predictions) {
				return self.aggregateFuturePredictions(predictions);
			});
		});
	},
	aggregateFuturePredictions: function (predictions) {
		if (!predictions || predictions.length < 0) {
			return Promise.resolve([]);
		}
		let result = {};
		predictions.forEach(function (prediction) {
			if (!result.hasOwnProperty(prediction.teamId)) {
				result[prediction.teamId] = {};
			}

			if (!result[prediction.teamId].hasOwnProperty(prediction.team)) {
				result[prediction.teamId][prediction.team] = 1;
			} else {
				result[prediction.teamId][prediction.team]++;
			}
		});
		return Promise.resolve(result);
	},
	getTeamIdsArr: function (predictions) {
		return predictions.map(function (prediction) {
			return prediction.teamId;
		});
	}
};