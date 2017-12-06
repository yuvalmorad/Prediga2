var Q = require('q');
var UserScore = require('../models/userScore');
var UsersLeaderboard = require('../models/usersLeaderboard');
var User = require('../models/user');
var Match = require('../models/match');
var Team = require('../models/team');
var PredictionScoreConfiguration = require('../models/predictionScoreConfiguration');

module.exports = {
    okResponse: {"status": "OK"},
    errorResponse: {"status": "Error", "message": "{0}"},
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.header('userId', req.user.id);
            return next();
        } else {
            res.status(401).json({});
        }
    },

    isAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.hasRole('admin')) {
            return next();
        } else {
            res.status(403).json({});
        }
    },

    updateScore: function (userScore) {
        var deferred = Q.defer();
        UserScore.findOneAndUpdate({userId: userScore.userId, gameId: userScore.gameId}, userScore, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, obj) {
                if (err) {
                    deferred.resolve('error');
                } else {
                    deferred.resolve(obj);
                }
            }
        );
        return deferred.promise;
    },

    updateLeaderboard: function () {
        var deferred = Q.defer();

        // 1. iterate all users
        User.find({}, function (err, users) {
            if (err) {
                deferred.resolve('error');
            } else {
                // 2. for each user, get all user's score
                users.forEach(function (aUser) {
                    UserScore.find({userId: aUser._id}, function (err, userScores) {
                        if (userScores && userScores.length > 0) {
                            var aggregrateScore = {
                                userId: aUser._id,
                                score: 0,
                                strikes: 0
                            };
                            var itemsProcessed = 0;
                            userScores.forEach(function (aUserScore) {
                                if (aUserScore.score) {
                                    aggregrateScore.score += aUserScore.score;
                                }
                                if (aUserScore.strikes) {
                                    aggregrateScore.strikes += aUserScore.strikes;
                                }

                                UsersLeaderboard.findOneAndUpdate({userId: aUser._id}, aggregrateScore, {
                                        upsert: true, setDefaultsOnInsert: true
                                    }, function (err, obj) {
                                        if (err) {
                                            deferred.resolve('error');
                                        } else {
                                            itemsProcessed++;
                                            if (itemsProcessed === userScores.length) {
                                                deferred.resolve({});
                                            }
                                        }
                                    }
                                );
                            });
                        } else {
                            // remove leaderboard for this user because there are no scores.
                            UsersLeaderboard.remove({userId: aUser._id}, function (err) {
                                deferred.resolve({});
                            });
                        }
                    });
                });
            }
        });
        return deferred.promise;
    },
    calculateResult: function (userPrediction, realResult, configScore) {
        if (userPrediction === realResult) {
            return configScore;
        } else {
            return 0;
        }
    },
    createMatches: function (matches) {
        var deferred = Q.defer();
        var itemsProcessed = 0;
        matches.forEach(function (match) {
            Match.findOneAndUpdate({_id: match._id}, match, {
                    upsert: true,
                    setDefaultsOnInsert: true
                }, function (err, obj) {
                    if (err) {
                        deferred.resolve(util.errorResponse.format(err.message));
                    } else {
                        itemsProcessed++;
                        if (itemsProcessed === matches.length) {
                            deferred.resolve(matches);
                        }
                    }
                }
            );
        });
        return deferred.promise;
    },
    createTeams: function (teams) {
        var deferred = Q.defer();
        var itemsProcessed = 0;
        teams.forEach(function (team) {
            Team.findOneAndUpdate({_id: team._id}, team, {
                    upsert: true,
                    setDefaultsOnInsert: true
                }, function (err, obj) {
                    if (err) {
                        deferred.resolve(err.message);
                    } else {
                        itemsProcessed++;
                        if (itemsProcessed === teams.length) {
                            deferred.resolve(teams);
                        }
                    }
                }
            );
        });
        return deferred.promise;
    },
    createConfiguration: function (predictionScoreConfiguration) {
        var deferred = Q.defer();
        PredictionScoreConfiguration.findOneAndUpdate({}, predictionScoreConfiguration, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, obj) {
                if (err) {
                    deferred.resolve(util.errorResponse.format('error'));
                } else {
                    deferred.resolve(predictionScoreConfiguration);
                }
            }
        );
        return deferred.promise;
    }
};