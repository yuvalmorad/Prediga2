var Q = require('q');
var UserScore = require('../models/userScore');
var UsersLeaderboard = require('../models/usersLeaderboard');
var User = require('../models/user');

module.exports = {
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
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
                        if (userScores) {
                            var aggregrateScore = {
                                userId: aUser._id,
                                score: 0,
                                strike: 0
                            };
                            var itemsProcessed = 0;
                            userScores.forEach(function (aUserScore) {
                                if (aUserScore.score) {
                                    aggregrateScore.score += aUserScore.score;
                                }
                                if (aUserScore.strike) {
                                    aggregrateScore.strike += aUserScore.strike;
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
                            deferred.resolve({});
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
    convertTeamTypeToConfigScore: function (type, configuration) {
        if (!type) {
            return configuration.teamInGroup;
        } else if (type === 'winner') {
            return configuration.teamWinner;
        } else if (type === 'runnerUp') {
            return configuration.teamRunnerUp;
        } else {
            return configuration.teamInGroup;
        }
    }
};