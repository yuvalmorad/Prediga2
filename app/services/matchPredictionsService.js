const Q = require('q');
const Match = require('../models/match');
const MatchPrediction = require('../models/matchPrediction');
const utils = require('../utils/util');

const self = module.exports = {
	/**
	 * NOT SECURE API, USED BY /SIMULATOR AND MATCHES ARE FILTERED BEFORE CALLING TO THIS METHOD
	 * @param matches
	 * @returns {*|PromiseLike<any>|Promise}
	 */
	findPredictionsByMatchIds: function (matches) {
		const deferred = Q.defer();
		if (matches && matches.length < 1) {
			deferred.resolve([]);
		}
		const matchIds = matches.map(function (match) {
			return match._id;
		});
		MatchPrediction.find({matchId: {$in: matchIds}}).then(function (predictions) {
			deferred.resolve(predictions);
		});
		return deferred.promise;
	},
	createMatchPredictions(matchPredictions, userId, minBefore) {
		const now = new Date();
		const deadline = new Date();
		deadline.setMinutes(now.getMinutes() + minBefore);
		const promises = matchPredictions.map(function (matchPrediction) {
			// we can update only until 5 minutes before kick off time.
			return Match.findOne({kickofftime: {$gte: deadline}, _id: matchPrediction.matchId}).then(function (aMatch) {
				if (aMatch) {
					// fixing wrong input
					if (typeof(matchPrediction.winner) === 'undefined') {
						matchPrediction.winner = 'draw';
					}
					if (typeof(matchPrediction.firstToScore) === 'undefined') {
						matchPrediction.firstToScore = 'none';
					}
					// validation:
					if (((matchPrediction.winner !== aMatch.team1) && (matchPrediction.winner !== aMatch.team2) && (matchPrediction.winner.toLowerCase() !== "draw")) ||
						((matchPrediction.firstToScore !== aMatch.team1) && (matchPrediction.firstToScore !== aMatch.team2) && matchPrediction.firstToScore.toLowerCase() !== "none") ||
						matchPrediction.team1Goals < 0 || matchPrediction.team2Goals < 0 || matchPrediction.goalDiff < 0) {
						return Promise.reject('general error');
					}

					matchPrediction.userId = userId;
					return MatchPrediction.findOneAndUpdate({
						matchId: matchPrediction.matchId,
						userId: userId
					}, matchPrediction, utils.updateSettings);
				} else {
					return Promise.reject('general error');
				}
			});
		});

		return Promise.all(promises);
	},
	getPredictionsForOtherUsersInner: function (matches, userId, me) {
		const promises = matches.map(function (aMatch) {
			if (userId) {
				return MatchPrediction.find({matchId: aMatch._id, userId: userId});
			} else {
				return MatchPrediction.find({matchId: aMatch._id, userId: {$ne: me}});
			}
		});
		return Promise.all(promises);
	},
	getPredictionsForOtherUsers: function (userId, me, matchIds) {
		const now = new Date();
		return Promise.all([
			typeof(matchIds) === 'undefined' ?
				Match.find({kickofftime: {$lt: now}}) :
				Match.find({kickofftime: {$lt: now}, _id: {$in: matchIds}})
		]).then(function (arr) {
			return Promise.all([
				self.getPredictionsForOtherUsersInner(arr[0], userId, me),
				typeof(matchIds) === 'undefined' ?
					MatchPrediction.find({userId: me}) :
					MatchPrediction.find({matchId: {$in: matchIds}, userId: me})
			]).then(function (arr2) {
				let mergedPredictions = [];
				// merging between others & My predictions
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
	getPredictionsByUserId: function (userId, isForMe, me, matchIds) {
		const deferred = Q.defer();

		if (isForMe) {
			if (typeof(matchIds) !== 'undefined') {
				MatchPrediction.find({userId: userId, matchId: {$in: matchIds}}, function (err, aMatchPredictions) {
					deferred.resolve(aMatchPredictions);
				});
			} else {
				MatchPrediction.find({userId: userId}, function (err, aMatchPredictions) {
					deferred.resolve(aMatchPredictions);
				});
			}

		} else {
			self.getPredictionsForOtherUsers(userId, me, matchIds).then(function (aMatchPredictions) {
				deferred.resolve(aMatchPredictions);
			});
		}

		return deferred.promise;
	},
	getPredictionsByMatchIds: function (matchIds, isForMe, me) {
		const deferred = Q.defer();

		if (isForMe) {
			MatchPrediction.find({matchId: matchIds}, function (err, aMatchPredictions) {
				deferred.resolve(aMatchPredictions);
			});
		} else {
			self.getPredictionsForOtherUsers(undefined, me, matchIds).then(function (aMatchPredictions) {
				deferred.resolve(aMatchPredictions);
			});
		}

		return deferred.promise;
	},
	getFutureGamesPredictionsCounters: function (matchIdsRelevant) {
		const now = new Date();
		return Promise.all([
			Match.find({kickofftime: {$gte: now}, _id: {$in: matchIdsRelevant}})
		]).then(function (arr) {
			const matchIds = arr[0].map(function (match) {
				return match._id;
			});

			return Promise.all([
				MatchPrediction.find({matchId: {$in: matchIds}})
			]).then(function (arr2) {
				return self.aggegrateFuturePredictions(arr2[0]);
			});
		});
	},
	aggegrateFuturePredictions: function (matchPredictions) {
		const deferred = Q.defer();
		const result = {};
		if (matchPredictions && matchPredictions.length > 0) {
			matchPredictions.forEach(function (matchPrediction, index) {
				if (!result.hasOwnProperty(matchPrediction.matchId)) {
					result[matchPrediction.matchId] = {};
				}

				if (!result[matchPrediction.matchId].hasOwnProperty(matchPrediction.winner)) {
					result[matchPrediction.matchId][matchPrediction.winner] = 1;
				} else {
					result[matchPrediction.matchId][matchPrediction.winner]++;
				}

				if (index === matchPredictions.length - 1) {
					deferred.resolve(result);
				}
			});
		} else {
			deferred.resolve(result);
		}

		return deferred.promise;
	}
};