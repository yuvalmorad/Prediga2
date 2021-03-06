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
					return Promise.resolve();
				}
				if (!self.validateAndCorrectInput(match, matchPrediction, userId, groupId)) {
					return Promise.resolve();
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
		matchPrediction.modifiedAt = new Date();

		// validation:
		return !(((matchPrediction.winner !== match.team1) && (matchPrediction.winner !== match.team2) && (matchPrediction.winner.toLowerCase() !== utils.MATCH_CONSTANTS.DRAW)) ||
			((matchPrediction.firstToScore !== match.team1) && (matchPrediction.firstToScore !== match.team2) && matchPrediction.firstToScore.toLowerCase() !== utils.MATCH_CONSTANTS.NONE) ||
			matchPrediction.team1Goals < 0 || matchPrediction.team2Goals < 0 || matchPrediction.goalDiff < 0);
	},
	getPredictionsForOtherUsersInner: function (matches, userId, groupId) {
		const promises = matches.map(function (aMatch) {
			return self.byMatchIdUserIdGroupId(aMatch._id, userId, groupId).then(function (matchPrediction) {
				if (matchPrediction) {
					return Promise.resolve(matchPrediction);
				} else {
					return Promise.resolve({});
				}
			});
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
			return self.getPredictionsForOtherUsersInner(matches, predictionRequest.userId, predictionRequest.groupId).then(function (predictions) {
				let predArr = [];
				predictions.forEach(function (prediction) {
					if (prediction && prediction !== null) {
						predArr.push(prediction);
					}
				});
				return Promise.resolve(predArr);
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
		if (!matchIds) {
			return Promise.resolve([]);
		}
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
	removeByGroupIdAndMatchIds: function (groupId, matchIds) {
		return MatchPrediction.remove({groupId: groupId, matchId: {$in: matchIds}});
	},
	removeByGroupIdAndUserId: function (groupId, userId) {
		return MatchPrediction.remove({groupId: groupId, userId: userId});
	},
	createRandomPrediction: function (matchId, userId, groupId) {
		return matchService.byId(matchId).then(function (match) {
            let randomMatchPrediction;
            if (userId === utils.MONKEY_GUNNER_USER_ID) {
                randomMatchPrediction = self.generateMatchPredictionForGunner(match, userId, groupId);
            } else {
                randomMatchPrediction = self.generateMatchPrediction(match, userId, groupId);
            }

			return self.updatePrediction(randomMatchPrediction, userId, groupId).then(function (newPrediction) {
				return Promise.resolve(newPrediction);
			});
		});
	},
	updatePrediction: function (matchPrediction, userId, groupId) {
        console.log('[updatePrediction] - User: ' + userId + ", GroupId: " + groupId + ", MatchId: "+ matchPrediction.matchId + "+ Date:" + new Date() + ", Prediction: winner: " + matchPrediction.winner + ", team1Goals:" + matchPrediction.team1Goals + ", team2Goals:" + matchPrediction.team2Goals + ", goalDiff:" + matchPrediction.goalDiff + ", firstToScore:" + matchPrediction.firstToScore
        );
		return MatchPrediction.findOneAndUpdate({
			matchId: matchPrediction.matchId,
			groupId: groupId,
			userId: userId
		}, matchPrediction, utils.updateSettings);
	},
	byMatchIdUserIdGroupId: function (matchId, userId, groupId) {
		return MatchPrediction.findOne({matchId: matchId, userId: userId, groupId: groupId});
	},
	byMatchIdsUserIdGroupId: function (matchIds, userId, groupId) {
		return MatchPrediction.find({matchId: {$in: matchIds}, userId: userId, groupId: groupId});
	},
	byMatchIdsGroupId: function (matchIds, groupId) {
		return MatchPrediction.find({matchId: {$in: matchIds}, groupId: groupId});
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
	},
	byMatchIdUserIds: function (matchId, userIds) {
		return MatchPrediction.find({userId: {$in: userIds}, matchId: matchId});
	},
	generateMatchPrediction: function (match, userId, groupId) {
        var options = self.getPredefinedOptions(match);
		let optionIdxToChoose = Math.floor((Math.random() * options.length));
		var generatedPrediction = options[optionIdxToChoose];
		return {
			matchId: match._id,
			groupId: groupId,
			userId: userId,
			winner: generatedPrediction.winner,
			firstToScore: generatedPrediction.firstToScore,
			team1Goals: generatedPrediction.team1Goals,
			team2Goals: generatedPrediction.team2Goals,
			goalDiff: generatedPrediction.goalDiff,
            isRandom: true
		};
	},
    getPredefinedOptions: function(match){
        var options = [];
        // 0-0
        options.push(
            {
                winner: 'Draw',
                firstToScore: 'None',
                team1Goals: 0,
                team2Goals: 0,
                goalDiff: 0,
            }
        );
        // 1-0
        options.push(
            {
                winner: match.team1,
                firstToScore: match.team1,
                team1Goals: 1,
                team2Goals: 0,
                goalDiff: 1,
            }
        );
        // 0-1
        options.push(
            {
                winner: match.team2,
                firstToScore: match.team2,
                team1Goals: 0,
                team2Goals: 1,
                goalDiff: 1,
            }
        );
        // 1-1
        options.push(
            {
                winner: 'Draw',
                firstToScore: match.team1,
                team1Goals: 1,
                team2Goals: 1,
                goalDiff: 0,
            }
        );
        // 1-1 2
        options.push(
            {
                winner: 'Draw',
                firstToScore: match.team2,
                team1Goals: 1,
                team2Goals: 1,
                goalDiff: 0,
            }
        );
        // 2-0
        options.push(
            {
                winner: match.team1,
                firstToScore: match.team1,
                team1Goals: 2,
                team2Goals: 0,
                goalDiff: 2,
            }
        );
        // 0-2
        options.push(
            {
                winner: match.team2,
                firstToScore: match.team2,
                team1Goals: 0,
                team2Goals: 2,
                goalDiff: 2,
            }
        );
        // 2-1
        options.push(
            {
                winner: match.team1,
                firstToScore: match.team1,
                team1Goals: 2,
                team2Goals: 1,
                goalDiff: 1,
            }
        );
        // 2-1 2
        options.push(
            {
                winner: match.team1,
                firstToScore: match.team2,
                team1Goals: 2,
                team2Goals: 1,
                goalDiff: 1,
            }
        );
        // 1-2
        options.push(
            {
                winner: match.team2,
                firstToScore: match.team2,
                team1Goals: 1,
                team2Goals: 2,
                goalDiff: 1,
            }
        );
        // 1-2 1
        options.push(
            {
                winner: match.team2,
                firstToScore: match.team1,
                team1Goals: 1,
                team2Goals: 2,
                goalDiff: 1,
            }
        );
        return options;
    },
    generateMatchPredictionForGunner: function (match, userId, groupId) {
        let winnerRandomValue = Math.floor((Math.random() * 3));
        let firstToScoreRandomValue = Math.floor((Math.random() * 2));
        return {
            matchId: match._id,
            groupId: groupId,
            userId: userId,
            winner: winnerRandomValue === 0 ? match.team1 : winnerRandomValue === 1 ? match.team2 : 'Draw',
            firstToScore: firstToScoreRandomValue === 0 ? match.team1 : match.team2,
            team1Goals: Math.floor((Math.random() * 2)), // [0-2]
            team2Goals: Math.floor((Math.random() * 2)), // [0-2]
            goalDiff: Math.floor((Math.random() * 2)), // [0-1]
            isRandom: true
        };
    },
	getUserIdsWithoutMatchPredictions: function (matchId, relevantUsers) {
		return self.byMatchIdUserIds(matchId, relevantUsers).then(function (matchPredictions) {
			if (!matchPredictions){
				return Promise.resolve([]);
			}
			let usersWithPrediction = [];
			matchPredictions.forEach(function (matchPrediction) {
				if (usersWithPrediction.indexOf(matchPrediction.userId) === -1) {
					usersWithPrediction.push(matchPrediction.userId);
				}
			});
			let usersWithoutPredictions = relevantUsers.filter(function (n) {
				return usersWithPrediction.indexOf(n) === -1;
			});
			return Promise.resolve(usersWithoutPredictions);
		});
	}
};