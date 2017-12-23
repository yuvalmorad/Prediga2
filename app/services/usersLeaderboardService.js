let Q = require('q');
let User = require('../models/user');
let League = require('../models/league');
let UserScore = require('../models/userScore');
let UsersLeaderboard = require('../models/usersLeaderboard');
let utils = require('../utils/util');

let self = module.exports = {
    updateLeaderboard: function () {
        return Promise.all([
            User.find({}),
            League.find({})
        ]).then(function (arr) {
            let users = arr[0];
            let promises = arr[1].map(function (league) {
                let leagueId = league._id;
                console.log('Beginning to updateLeaderboard for league ' + league.name);
                return Promise.all([
                    self.calculatedAggregatedUserScores(leagueId, users)
                ]).then(function (arr) {
                    // sort aggregated scores by score desc.
                    arr[0].sort(self.compareAggregatedScores);

                    return self.updateAllAggregatedScores(leagueId, arr[0]).then(function () {
                        console.log('finished to update the leader board based on all user scores');
                    });
                });
            });

            return Promise.all(promises);
        });
    },
    updateAllAggregatedScores: function (leagueId, aggregatedScores) {
        let promises = aggregatedScores.map(function (aggregatedScore, index) {
            return self.updateOneAggregatedScore(leagueId, aggregatedScore, index);
        });

        return Promise.all(promises);
    },
    updateOneAggregatedScore: function (leagueId, aggregatedScore, index) {
        let deferred = Q.defer();

        UsersLeaderboard.find({userId: aggregatedScore.userId, leagueId: leagueId}, function (err, obj) {
            let placeBeforeLastGame = -1;
            if (obj && obj.length > 0 && typeof(obj[0].placeCurrent) !== 'undefined') {
                placeBeforeLastGame = obj[0].placeCurrent;
            }

            aggregatedScore.placeCurrent = index + 1;
            aggregatedScore.placeBeforeLastGame = placeBeforeLastGame;
            UsersLeaderboard.findOneAndUpdate({
                    userId: aggregatedScore.userId,
                    leagueId: leagueId
                }, aggregatedScore, utils.updateSettings,
                function () {
                    deferred.resolve();
                }
            );
        });
        return deferred.promise;
    },
    calculatedAggregatedUserScores: function (leagueId, users) {
        let promises = users.map(function (aUser) {
            return self.calculatedAggregatedUserScore(leagueId, aUser);
        });

        return Promise.all(promises);
    },
    calculatedAggregatedUserScore: function (leagueId, aUser) {
        let deferred = Q.defer();

        UserScore.find({userId: aUser._id, leagueId: leagueId}, function (err, userScores) {
            let aggregrateScore = {
                leagueId: leagueId,
                userId: aUser._id,
                score: 0,
                strikes: 0
            };
            if (userScores && userScores.length > 0) {
                self.calculatedAggregatedUserScoreForEachUserScore(leagueId, aUser, userScores, aggregrateScore).then(function (aggregrateScore) {
                    deferred.resolve(aggregrateScore);
                });
            } else {
                deferred.resolve(aggregrateScore);
            }
        });
        return deferred.promise;
    },
    calculatedAggregatedUserScoreForEachUserScore: function (leagueId, aUser, userScores, aggregrateScore) {
        let deferred = Q.defer();

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
    getLeaderboardWithNewRegisteredUsers: function (leagueId) {
        return Promise.all([
            User.find({}),
            typeof(leagueId) === 'undefined' ?
                League.find({}) :
                League.find({_id: leagueId})
        ]).then(function (arr) {
            let allUsers = arr[0];
            let promises = arr[1].map(function (league) {
                let leagueId = league._id;
                return Promise.all([
                    UsersLeaderboard.find({leagueId: leagueId}).sort({'score': -1})
                ]).then(function (arr) {
                    return self.amendNewRegisteredUsers(arr[0], allUsers, leagueId);
                });
            });

            return Promise.all(promises);
        });
    },
    amendNewRegisteredUsers: function (leaderboard, allUsers, leagueId) {
        let userIdsInLeaderboard = leaderboard.map(a => a.userId.toString());
        let allUsersIds = allUsers.map(a => a._id.toString());
        let userIdsNotInLeaderboard = allUsersIds.filter(x => userIdsInLeaderboard.indexOf(x) === -1);
        if (userIdsNotInLeaderboard && userIdsNotInLeaderboard.length > 0) {
            let promises = userIdsNotInLeaderboard.map(function (userId) {
                self.amendNewRegisteredUser(leaderboard, userId, leagueId);
                return leaderboard;
            });
            return Promise.all(promises);
        } else {
            return leaderboard;
        }
    },
    amendNewRegisteredUser: function (leaderboard, userId, leagueId) {
        let userItem = {
            leagueId: leagueId,
            userId: userId,
            score: 0,
            strikes: 0,
            placeCurrent: -1,
            placeBeforeLastGame: -1,
        };
        return Promise.all([
            UsersLeaderboard.findOneAndUpdate({userId: userId, leagueId: leagueId}, userItem, utils.updateSettings)
        ]).then(function (arr) {
            leaderboard.splice(leaderboard.length - 1, 0, userItem);
            return {}
        });
    }
};