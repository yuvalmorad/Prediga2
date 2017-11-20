var express = require('express');
var app = express.Router();
var MatchResult = require('../models/matchResult');
var PredictionScoreConfiguration = require('../models/predictionScoreConfiguration');
var MatchPrediction = require('../models/matchPrediction');
var util = require('../utils/util.js');
var Q = require('q');

app.get('/', util.isLoggedIn, function (req, res) {
    MatchResult.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

app.get('/:matchId', util.isLoggedIn, function (req, res) {
    var matchId = req.params.matchId;
    if (!matchId) {
        res.status(500).json(util.errorResponse.format('provide matchId'));
        return;
    }
    MatchResult.findOne({matchId: matchId}, function (err, obj) {
        if (err || !obj) {
            res.status(403).json(util.errorResponse.format('no match result'));
        } else {
            res.status(200).json(obj);
        }
    });
});

app.post('/', util.isAdmin, function (req, res) {
    var matchResult = req.body.matchResult;
    if (!matchResult) {
        res.status(500).json(util.errorResponse.format('provide matchResult'));
        return;
    }

    updateMatchResult(matchResult).then(function (obj) {
        if (typeof(obj) === "undefined") {
            res.status(500).json(util.errorResponse.format('error'));
        } else {
            updateMatchScore(matchResult).then(function (obj2) {
                util.updateLeaderboard().then(function (obj3) {
                    res.status(200).json(util.okResponse);
                });
            });
        }
    });
});

function updateMatchResult(matchResult) {
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
}

function updateMatchScore(matchResult) {
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
                        var isStrike = score === (configuration.winner + configuration.team1Goals + configuration.team2Goals + configuration.goalDiff + configuration.firstToScore);
                        var userScore = {
                            userId: userPrediction.userId,
                            gameId: userPrediction.matchId,
                            score: score,
                            strikes: isStrike ? 1 : 0
                        };

                        util.updateScore(userScore).then(function (res) {
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

module.exports = app;