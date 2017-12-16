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
            return self.updateOneAggregatedScore(aggregatedScore, index);
        });

        return Promise.all(promises);
    },
    updateOneAggregatedScore: function (aggregatedScore, index) {
        var deferred = Q.defer();

        UsersLeaderboard.find({userId: aggregatedScore.userId}, function (err, obj) {
            var placeBeforeLastGame = -1;
            if (obj && obj.length > 0 && typeof(obj[0].placeCurrent) !== 'undefined') {
                placeBeforeLastGame = obj[0].placeCurrent;
            }

            aggregatedScore.placeCurrent = index + 1;
            aggregatedScore.placeBeforeLastGame = placeBeforeLastGame;
            UsersLeaderboard.findOneAndUpdate({userId: aggregatedScore.userId}, aggregatedScore, {
                    upsert: true, setDefaultsOnInsert: true, isNew: true
                },
                function () {
                    deferred.resolve();
                }
            );
        });
        return deferred.promise;
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
            if (userScores && userScores.length > 0) {
                self.calculatedAggregatedUserScoreForEachUserScore(aUser, userScores).then(function (aggregrateScore) {
                    deferred.resolve(aggregrateScore);
                });
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    },
    calculatedAggregatedUserScoreForEachUserScore: function (aUser, userScores) {
        var deferred = Q.defer();
        var aggregrateScore = {
            userId: aUser._id,
            score: 0,
            strikes: 0
        };
        var itemsProcessed = 0;
        userScores.forEach(function (aUserScore) {
            itemsProcessed += 1;
            if (aUserScore.score) {
                aggregrateScore.score += aUserScore.score;
            }
            if (aUserScore.strikes) {
                aggregrateScore.strikes += aUserScore.strikes;
            }

            if (itemsProcessed == userScores.length) {
                deferred.resolve(aggregrateScore);
            }
        });
        return deferred.promise;
    },
    compareAggregatedScores: function (a, b) {
        if (a.score < b.score)
            return 1;
        if (a.score > b.score)
            return -1;
        return 0;
    },
    getLeaderboardWithNewRegisteredUsers: function () {
        return Promise.all([
            UsersLeaderboard.find({}).sort({'score': -1}),
            User.find({})
        ]).then(function (arr) {
            // amend newly registered users into the bottom of the leader board.
            var userIdsInLeaderboard = arr[0].map(a => a.userId.toString());
            var allUsersIds = arr[1].map(a => a._id.toString());
            var userIdsNotInLeaderboard = allUsersIds.filter(x => userIdsInLeaderboard.indexOf(x) == -1);
            var leaderboardArr = arr[0];
            if (userIdsNotInLeaderboard && userIdsNotInLeaderboard.length > 0) {
                userIdsNotInLeaderboard.forEach(function (userId) {
                    // add to the bottom
                    leaderboardArr.splice(leaderboardArr.length - 1, 0, {
                        userId: userId,
                        score: 0,
                        strikes: 0
                    });
                });
            }

            return {
                leaderboard: leaderboardArr,
                users: arr[1]
            }
        });
        //,
    }
};