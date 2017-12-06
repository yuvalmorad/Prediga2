var Q = require('q');
var MatchResult = require('../models/matchResult');
var PredictionScoreConfiguration = require('../models/predictionScoreConfiguration');
var MatchPrediction = require('../models/matchPrediction');
var UserScoreService = require('../services/userScoreService');
var util = require('../utils/util');

module.exports = {
    updateMatchResult: function (matchResult) {
        var deferred = Q.defer();
        MatchResult.findOneAndUpdate({matchId: matchResult.matchId}, matchResult, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, obj) {
                if (err) {
                    deferred.resolve(undefined);
                } else {
                    deferred.resolve(matchResult);
                }
            }
        );
        return deferred.promise;
    },

    updateMatchScore: function (matchResult) {
        var deferred = Q.defer();
        // 1. get prediction score configuration obj
        PredictionScoreConfiguration.find({}, function (err, configuration) {
            if (!err && configuration) {
                // 2. get all predictions of this match
                MatchPrediction.find({matchId: matchResult.matchId}, function (err, aMatchPredictions) {
                    // 3. for each one calculate user score and call update.
                    if (aMatchPredictions && aMatchPredictions.length > 0) {
                        var itemsProcessed = 0;
                        aMatchPredictions.forEach(function (userPrediction) {
                            var score = 0;
                            score += util.calculateResult(userPrediction.winner, matchResult.winner, configuration[0].winner);
                            score += util.calculateResult(userPrediction.team1Goals, matchResult.team1Goals, configuration[0].team1Goals);
                            score += util.calculateResult(userPrediction.team2Goals, matchResult.team2Goals, configuration[0].team2Goals);
                            score += util.calculateResult(userPrediction.goalDiff, matchResult.goalDiff, configuration[0].goalDiff);
                            score += util.calculateResult(userPrediction.firstToScore, matchResult.firstToScore, configuration[0].firstToScore);
                            var isStrike = score === (configuration[0].winner + configuration[0].team1Goals + configuration[0].team2Goals + configuration[0].goalDiff + configuration[0].firstToScore);
                            var userScore = {
                                userId: userPrediction.userId,
                                gameId: userPrediction.matchId,
                                score: score,
                                strikes: isStrike ? 1 : 0
                            };

                            UserScoreService.updateScore(userScore).then(function (res) {
                                itemsProcessed++;
                                if (itemsProcessed === aMatchPredictions.length) {
                                    deferred.resolve({});
                                }
                            });
                        });

                    } else {
                        deferred.resolve({});
                    }
                });
            }
        });
        return deferred.promise;
    }
};