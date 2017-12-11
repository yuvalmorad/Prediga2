var Q = require('q');
var User = require('../models/user');
var UserScore = require('../models/userScore');
var UsersLeaderboard = require('../models/usersLeaderboard');

var self = module.exports = {
    updateLeaderboard: function () {
        var deferred = Q.defer();

        console.log('beginning to update the leader board based on all user scores');
        // iterating all users
        User.find({}, function (err, users) {
            if (err) {
                deferred.resolve('error');
            } else {
                self.calculatedAggregatedUserScores(users).then(function (aggregatedScores) {
                    // sort aggregated scores by score desc.
                    aggregatedScores.sort(self.compareAggregatedScores);

                    self.updateAllAggregatedScores(aggregatedScores).then(function () {
                        console.log('finished to update the leader board based on all user scores');
                        deferred.resolve();
                    });
                });
            }
        });
        return deferred.promise;
    },
    updateAllAggregatedScores: function (aggregatedScores) {
        var promises = aggregatedScores.map(function (aggregatedScore, index) {
            // for each new score find the old score and save updated trend.
            return UsersLeaderboard.find({userId: aggregatedScore.userId}, function (err, obj) {
                var placeBeforeLastGame = -1;
                if (obj && obj.length > 0 && typeof(obj[0].placeCurrent) !== 'undefined') {
                    placeBeforeLastGame = obj[0].placeCurrent;
                }

                aggregatedScore.placeCurrent = index + 1;
                aggregatedScore.placeBeforeLastGame = placeBeforeLastGame;
                return UsersLeaderboard.findOneAndUpdate({userId: aggregatedScore.userId}, aggregatedScore, {
                        upsert: true, setDefaultsOnInsert: true, isNew: true
                    }, function (err, obj) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('successfully updateAllAggregatedScores');
                        }
                    }
                );

            });
        });

        return Promise.all(promises);
    },
    calculatedAggregatedUserScores: function (users) {
        var promises = users.map(function (aUser) {
            return self.calculatedAggregatedUserScore(aUser);
        });

        return Promise.all(promises);
    },
    calculatedAggregatedUserScore: function (aUser) {
        var deferred = Q.defer();

        UserScore.find({userId: aUser._id}, function (err, userScores) {
            var aggregrateScore = {
                userId: aUser._id,
                score: 0,
                strikes: 0
            };

            if (userScores && userScores.length > 0) {
                userScores.forEach(function (aUserScore) {
                    if (aUserScore.score) {
                        aggregrateScore.score += aUserScore.score;
                    }
                    if (aUserScore.strikes) {
                        aggregrateScore.strikes += aUserScore.strikes;
                    }
                });
            }

            deferred.resolve(aggregrateScore);
        });
        return deferred.promise;
    },
    compareAggregatedScores: function (a, b) {
        if (a.score < b.score)
            return 1;
        if (a.score > b.score)
            return -1;
        return 0;
    }
};