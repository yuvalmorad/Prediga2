const Q = require('q');
const Team = require('../models/team');
const TeamPrediction = require('../models/teamPrediction');
const utils = require('../utils/util');
const self = module.exports = {
	createTeamPredictions(groupId, teamPredictions, userId) {
		const now = new Date();
		const promises = teamPredictions.map(function (teamPrediction) {
			// we can update only if the kickofftime is not passed
			return Team.findOne({deadline: {$gte: now}, _id: teamPrediction.teamId}).then(function (aTeam) {
				if (aTeam) {
					teamPrediction.userId = userId;
					return TeamPrediction.findOneAndUpdate({
						teamId: teamPrediction.teamId,
						groupId: groupId,
						userId: userId
					}, teamPrediction, utils.updateSettings);
				} else {
					return Promise.reject('general error');
				}
			});
		});

		return Promise.all(promises);
	},
	getPredictionsForOtherUsersInner: function (teams, userId, me, groupId) {
		const promises = teams.map(function (aTeam) {
			if (userId) {
				return TeamPrediction.find({teamId: aTeam._id, userId: userId, groupId: groupId});
			} else {
				return TeamPrediction.find({teamId: aTeam._id, groupId: groupId});
			}
		});
		return Promise.all(promises);
	},
	getPredictionsForOtherUsers: function (predictionRequest) {
		const now = new Date();
		return Promise.all([
			typeof(predictionRequest.teamIds) === 'undefined' ?
				Team.find({deadline: {$lt: now}}) :
				Team.find({deadline: {$lt: now}, _id: {$in: predictionRequest.teamIds}})
		]).then(function (arr) {
			return Promise.all([
				self.getPredictionsForOtherUsersInner(arr[0], predictionRequest.userId, predictionRequest.me, predictionRequest.groupId),
				typeof(predictionRequest.teamIds) === 'undefined' ?
					TeamPrediction.find({userId: predictionRequest.me, groupId: predictionRequest.groupId}) :
					TeamPrediction.find({
						teamId: {$in: predictionRequest.teamIds},
						userId: predictionRequest.me,
						groupId: predictionRequest.groupId
					})
			]).then(function (arr2) {
				let mergedPredictions = [];

				// Merging between other & My predictions
				if (arr2[0]) {
					mergedPredictions = mergedPredictions.concat.apply([], arr2[0]);
				}
				if (arr2[1]) {
					mergedPredictions = mergedPredictions.concat(arr2[1]);
				}
				return mergedPredictions;
			});
		});
	},
	getPredictionsByUserId: function (predictionRequest) {
		const deferred = Q.defer();

		if (predictionRequest.isForMe) {
			if (typeof(predictionRequest.teamIds) !== 'undefined') {
				TeamPrediction.find({
					userId: predictionRequest.userId,
					teamId: {$in: predictionRequest.teamIds},
					groupId: predictionRequest.groupId
				}, function (err, aTeamPredictions) {
					deferred.resolve(aTeamPredictions);
				});
			} else {
				TeamPrediction.find({userId: predictionRequest.userId}, function (err, aTeamPredictions) {
					deferred.resolve(aTeamPredictions);
				});
			}

		} else {
			self.getPredictionsForOtherUsers(predictionRequest).then(function (aTeamPredictions) {
				deferred.resolve(aTeamPredictions);
			});
		}

		return deferred.promise;
	},
	getPredictionsByTeamId: function (predictionRequest) {
		const deferred = Q.defer();

		if (predictionRequest.isForMe) {
			TeamPrediction.find({
				teamId: {$in: predictionRequest.teamIds}, groupId: predictionRequest.groupId
			}, function (err, aTeamPredictions) {
				deferred.resolve(aTeamPredictions);
			});
		} else {
			self.getPredictionsForOtherUsers(predictionRequest).then(function (aTeamPredictions) {
				deferred.resolve(aTeamPredictions);
			});
		}

		return deferred.promise;
	}
};