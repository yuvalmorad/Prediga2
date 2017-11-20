var express = require('express');
var app = express.Router();
var TeamResult = require('../models/teamResult');
var PredictionScoreConfiguration = require('../models/predictionScoreConfiguration');
var TeamPrediction = require('../models/teamPrediction');
var util = require('../utils/util.js');
var Q = require('q');

app.get('/', util.isLoggedIn, function (req, res) {
    TeamResult.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

app.get('/:teamId', util.isLoggedIn, function (req, res) {
    var teamId = req.params.teamId;
    if (!teamId) {
        res.status(500).json(util.errorResponse.format('provide teamId'));
        return;
    }
    TeamResult.findOne({teamId: teamId}, function (err, obj) {
        if (err || !obj) {
            res.status(403).json(util.errorResponse.format('no team result'));
        } else {
            res.status(200).json(obj);
        }
    });
});

app.post('/', util.isAdmin, function (req, res) {
    var teamResult = req.body.teamResult;
    if (!teamResult) {
        res.status(500).json(util.errorResponse.format('provide teamResult'));
        return;
    }

    updateTeamResult(teamResult).then(function (obj) {
        if (typeof(obj) === "undefined") {
            res.status(500).json(util.errorResponse.format('error'));
        } else {
            updateTeamScore(teamResult).then(function (obj2) {
                util.updateLeaderboard().then(function (obj3) {
                    res.status(200).json(util.okResponse);
                });
            });
        }
    });
});

function updateTeamResult(teamResult) {
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
}

function updateTeamScore(teamResult) {
    var deferred = Q.defer();
    // 1. get prediction score configuration obj
    PredictionScoreConfiguration.find({}, function (err, configuration) {
        if (!err && configuration) {
            // 2. get all predictions of this match
            TeamPrediction.find({teamId: teamResult.teamId}, function (err, aTeamPredictions) {
                // 3. for each one calculate user score and call update.
                if (aTeamPredictions && aTeamPredictions.length > 0) {
                    var itemsProcessed = 0;
                    aTeamPredictions.forEach(function (userPrediction) {
                        var score = 0;
                        score += util.calculateResult(userPrediction.team, teamResult.team, util.convertTeamTypeToConfigScore(teamResult.type, configuration[0]));
                        var userScore = {
                            userId: userPrediction.userId,
                            gameId: userPrediction.teamId,
                            score: score,
                            strikes: 0
                        };

                        util.updateScore(userScore).then(function (res) {
                            itemsProcessed++;
                            if (itemsProcessed === aTeamPredictions.length) {
                                deferred.resolve(teamResult);
                            }
                        });
                    });

                } else {
                    deferred.resolve(teamResult);
                }
            });
        }
    });
    return deferred.promise;
}

module.exports = app;