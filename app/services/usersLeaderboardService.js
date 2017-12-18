let Q = require('q');
let User = require('../models/user');
let UserScore = require('../models/userScore');
let UsersLeaderboard = require('../models/usersLeaderboard');

let self = module.exports = {
    updateLeaderboard: function () {
        let deferred = Q.defer();

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
        let promises = aggregatedScores.map(function (aggregatedScore, index) {
            return self.updateOneAggregatedScore(aggregatedScore, index);
        });

        return Promise.all(promises);
    },
    updateOneAggregatedScore: function (aggregatedScore, index) {
        let deferred = Q.defer();

        UsersLeaderboard.find({userId: aggregatedScore.userId}, function (err, obj) {
            let placeBeforeLastGame = -1;
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
        let promises = users.map(function (aUser) {
            return self.calculatedAggregatedUserScore(aUser);
        });

        return Promise.all(promises);
    },
    calculatedAggregatedUserScore: function (aUser) {
        let deferred = Q.defer();

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
        let deferred = Q.defer();
        let aggregrateScore = {
            userId: aUser._id,
            score: 0,
            strikes: 0
        };
        let itemsProcessed = 0;
        userScores.forEach(function (aUserScore) {
            itemsProcessed += 1;
            if (aUserScore.score) {
                aggregrateScore.score += aUserScore.score;
            }
            if (aUserScore.strikes) {
                aggregrateScore.strikes += aUserScore.strikes;
            }

            if (itemsProcessed === userScores.length) {
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
            let userIdsInLeaderboard = arr[0].map(a => a.userId.toString());
            let allUsersIds = arr[1].map(a => a._id.toString());
            let userIdsNotInLeaderboard = allUsersIds.filter(x => userIdsInLeaderboard.indexOf(x) === -1);
            let leaderboardArr = arr[0];
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
    }
};