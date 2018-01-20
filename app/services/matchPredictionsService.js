const MatchPrediction = require('../models/matchPrediction');
const utils = require('../utils/util');
const matchService = require('./matchService.js');

const self = module.exports = {
	byGroupIdAndMatches: function (groupId, matches) {
		if (!matches || matches.length < 1) {
			return Promise.resolve([]);
		}
		const matchIds = matchService.getIdArr(matches);
		return self.byMatchIdsGroupId(matchIds, groupId).then(function (predictions) {
			return Promise.resolve(predictions);
		});
	},
	createMatchPredictions(groupId, matchPredictions, userId, minutesBeforeStartGameDeadline) {
		const deadline = new Date().setMinutes(new Date().getMinutes() + minutesBeforeStartGameDeadline);
		const promises = matchPredictions.map(function (matchPrediction) {
			// we can update only until 5 minutes before kick off time.
			return matchService.byIdAndStartBeforeDate(matchPrediction.matchId, deadline).then(function (match) {
				if (!match) {
					return Promise.reject();
				}
				if (!self.validateAndCorrectInput(match, matchPrediction, userId, groupId)) {
					return Promise.reject();
				}
				return self.updatePrediction(matchPrediction, userId, groupId).then(function (newPrediction) {
					return Promise.resolve(newPrediction);
				});
			});
		});

		return Promise.all(promises);
	},
	validateAndCorrectInput: function (match, matchPrediction, userId, groupId) {
		if (typeof(matchPrediction.winner) === 'undefined') {
			matchPrediction.winner = utils.MATCH_CONSTANTS.DRAW;
		}
		if (typeof(matchPrediction.firstToScore) === 'undefined') {
			matchPrediction.firstToScore = utils.MATCH_CONSTANTS.NONE;
		}
		matchPrediction.userId = userId;
		matchPrediction.groupId = groupId;

		// validation:
		return !(((matchPrediction.winner !== match.team1) && (matchPrediction.winner !== match.team2) && (matchPrediction.winner.toLowerCase() !== utils.MATCH_CONSTANTS.DRAW)) ||
			((matchPrediction.firstToScore !== match.team1) && (matchPrediction.firstToScore !== aMatch.team2) && matchPrediction.firstToScore.toLowerCase() !== utils.MATCH_CONSTANTS.NONE) ||
			matchPrediction.team1Goals < 0 || matchPrediction.team2Goals < 0 || matchPrediction.goalDiff < 0);
	},
	getPredictionsForOtherUsersInner: function (matches, userId, me, groupId) {
		const promises = matches.map(function (aMatch) {
			if (userId) {
				return self.byMatchIdUserIdGroupId(aMatch._id, userId, groupId);
			} else {
				return self.byMatchIdNotUserIdGroupId(aMatch._id, me, groupId);
			}
		});
		return Promise.all(promises);
	},
	getPredictionsForMeInner: function (matchIds, me, groupId) {
		if (typeof(matchIds) === 'undefined') {
			return self.byUserIdGroupId(me, groupId);
		} else {
			return self.byMatchIdsUserIdGroupId(matchIds, me, groupId);
		}
	},
	getPredictionsForOtherUsers: function (predictionRequest) {
		return matchService.filterIdsByMatchesAlreadyStarted(predictionRequest.matchIds).then(function (matches) {
			return Promise.all([
				self.getPredictionsForOtherUsersInner(matches, predictionRequest.userId, predictionRequest.me, predictionRequest.groupId),
				self.getPredictionsForMeInner(predictionRequest.matchIds, predictionRequest.me, predictionRequest.groupId)
			]).then(function (predictionsArr) {
				return utils.mergeArr(predictionsArr);
			});
		});
	},
	getPredictionsByUserId: function (predictionRequest) {
		if (predictionRequest.isForMe) {
			return self.getPredictionsForMeInner(predictionRequest.matchIds, predictionRequest.userId, predictionRequest.groupId);
		} else {
			return self.getPredictionsForOtherUsers(predictionRequest).then(function (aMatchPredictions) {
				return Promise.resolve(aMatchPredictions);
			});
		}
	},
	getFutureGamesPredictionsCounters: function (groupId, matchIds) {
		if (!matchIds){
			return Promise.resolve([]);
		}
		//return Promise.resolve([]);
		return matchService.getNotStartedMatches(matchIds).then(function (matches) {
			if (!matches) {
				return Promise.resolve([]);
			}
			const relevantMatchIds = matchService.getIdArr(matches);
			return self.byMatchIdsGroupId(relevantMatchIds, groupId).then(function (predictions) {
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
			if (!result.hasOwnProperty(prediction.matchId)) {
				result[prediction.matchId] = {};
			}

			if (!result[prediction.matchId].hasOwnProperty(prediction.winner)) {
				result[prediction.matchId][prediction.winner] = 1;
			} else {
				result[prediction.matchId][prediction.winner]++;
			}
		});
		return Promise.resolve(result);
	},
	getMatchIdsArr: function (predictions) {
		return predictions.map(function (prediction) {
			return prediction.matchId;
		});
	},
	getGroupIdArr: function (predictions) {
		return predictions.map(function (prediction) {
			return prediction.groupId;
		});
	},
	removeByGroupId: function (groupId) {
		return MatchPrediction.remove({groupId: groupId});
	},
	removeByGroupIdAndUserId: function (groupId, userId) {
		return MatchPrediction.remove({groupId: groupId, userId: userId});
	},
	updatePrediction: function (matchPrediction, userId, groupId) {
		return MatchPrediction.findOneAndUpdate({
			matchId: matchPrediction.matchId,
			groupId: groupId,
			userId: userId
		}, matchPrediction, utils.updateSettings);
	},
	byMatchIdUserIdGroupId: function (matchId, userId, groupId) {
		return MatchPrediction.find({matchId: matchId, userId: userId, groupId: groupId});
	},
	byMatchIdsUserIdGroupId: function (matchIds, userId, groupId) {
		return MatchPrediction.find({matchId: {$in: matchIds}, userId: userId, groupId: groupId})
	},
	byMatchIdsGroupId: function (matchIds, groupId) {
		return MatchPrediction.find({matchId: {$in: matchIds}, groupId: groupId})
	},
	byUserIdGroupId: function (userId, groupId) {
		return MatchPrediction.find({userId: userId, groupId: groupId});
	},
	byMatchIdNotUserIdGroupId: function (matchId, userId, groupId) {
		return MatchPrediction.find({matchId: matchId, userId: {$ne: userId}, groupId: groupId});
	},
	byMatchId: function (matchId) {
		return MatchPrediction.find({matchId: matchId});
	},
	byMatchIdUserId: function (matchId, userId) {
		return MatchPrediction.findOne({matchId: matchId, userId: userId});
	}
};