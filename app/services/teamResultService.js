var Q = require('q');
var TeamResult = require('../models/teamResult');
var PredictionScoreConfiguration = require('../models/predictionScoreConfiguration');
var TeamPrediction = require('../models/teamPrediction');
var UserScoreService = require('../services/userScoreService');
var util = require('../utils/util');

module.exports = {
    updateTeamResult: function (teamResult) {
        var deferred = Q.defer();
        TeamResult.findOneAndUpdate({teamId: teamResult.teamId}, teamResult, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, obj) {
                if (err) {
                    deferred.resolve(util.errorResponse.format('error'));
                } else {
                    deferred.resolve(teamResult);
                }
            }
        );
        return deferred.promise;
    },

    updateTeamScore: function (teamResult) {
        var deferred = Q.defer();
        // 1. get prediction score configuration obj
        PredictionScoreConfiguration.find({}, function (err, configuration) {
            if (!err && configuration) {
                // 2. get all predictions of this match
                TeamPrediction.find({teamId: teamResult.teamId}, function (err, aTeamPredictions) {
                    // 3. for each one calculate user score and call update.
                    if (aTeamPredictions && aTeamPredictions.length > 0) {
                        var promises = aTeamPredictions.map(function (userPrediction) {
                            var score = 0;
                            var configScore = convertTeamTypeToConfigScore(teamResult.type, configuration[0]);
                            score += util.calculateResult(userPrediction.team, teamResult.team, configScore);

                            // score to update
                            var userScore = {
                                userId: userPrediction.userId,
                                gameId: userPrediction.teamId,
                                score: score,
                                strikes: 0
                            };

                            return UserScoreService.updateScore(userScore);
                        });

                        return Promise.all(promises);

                    } else {
                        deferred.resolve(teamResult);
                    }
                });
            }
        });
        return deferred.promise;
    },

    convertTeamTypeToConfigScore: function (type, configuration) {
        if (!type) {
            return configuration.teamInGroup;
        } else if (type === '1st') {
            return configuration.teamWinner;
        } else if (type === '2nd') {
            return configuration.teamRunnerUp;
        } else if (type === '3rd') {
            return configuration.teamThird;
        } else if (type === '4th') {
            return configuration.teamForth;
        } else if (type === '14th') {
            return configuration.teamLast;
        } else if (type === '13th') {
            return configuration.team2ndLast;
        } else {
            return configuration.teamInGroup;
        }
    }
};