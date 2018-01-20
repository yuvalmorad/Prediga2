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
	getPredictionsForOtherUsersInner: function (teams, userId, me, groupId) {
		const promises = teams.map(function (aTeam) {
			if (userId) {
				return self.byTeamIdUserIdGroupId(aTeam._id, userId, groupId);
			} else {
				return self.byTeamIdGroupId(aTeam._id, groupId);
			}
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
			return Promise.all([
				self.getPredictionsForOtherUsersInner(teams, predictionRequest.userId, predictionRequest.me, predictionRequest.groupId),
				self.getPredictionsForMeInner(predictionRequest.teamIds, predictionRequest.me, predictionRequest.groupId)
			]).then(function (predictionsArr) {
				return utils.mergeArr(predictionsArr);
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
	removeByGroupIdAndUserId: function (groupId, userId) {
		return TeamPrediction.remove({groupId: groupId, userId: userId});
	},
	byTeamIdUserIdGroupId: function (teamId, userId, groupId) {
		return TeamPrediction.find({teamId: teamId, userId: userId, groupId: groupId});
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
	}
};