const MatchResult = require("../models/matchResult");
const TeamResult = require("../models/teamResult");
const MatchPrediction = require("../models/matchPrediction");
const TeamPrediction = require("../models/teamPrediction");
const UserScore = require("../models/userScore");
const UserSettings = require("../models/userSettings");
const UsersLeaderboard = require("../models/usersLeaderboard");
const Club = require("../models/club");
const Match = require("../models/match");
const utils = require("../utils/util");
const Group = require("../models/group");
const User = require("../models/user");
const pushSubscription = require("../models/pushSubscription");

const self = module.exports = {

    run: function () {
        return Promise.all([
            //self.getTeamStats()
            //self.migrateUserScore(),
            //self.migrateLeaderboard(),
            //self.migrateMatchPredictions(),
            //self.migrateTeamPredictions(),
            //self.migrateUsers(),
            //self.migrateMatchResults()
            //self.migrateTeamResults()
            //self.migrateMatches()
            //self.whoFill()
            self.whenFill()
        ]).then(function (arr) {
            //console.log('[Init] - Migration finished');
        });
    },
    migrateUserScore: function () {
        return UserScore.find({}, function (err, userScores) {
            if (userScores) {
                const promises = userScores.map(function (userScore) {
                    userScore.groupId = utils.DEFAULT_GROUP;
                    return UserScore.findOneAndUpdate({_id: userScore._id}, userScore, utils.updateSettings);
                });
                return Promise.all(promises);
            }
        });
    },
    migrateLeaderboard: function () {
        return UsersLeaderboard.find({}, function (err, usersLeaderboards) {
            if (usersLeaderboards) {
                const promises = usersLeaderboards.map(function (usersLeaderboard) {
                    usersLeaderboard.groupId = utils.DEFAULT_GROUP;
                    return UsersLeaderboard.findOneAndUpdate({_id: usersLeaderboard._id}, usersLeaderboard, utils.updateSettings);
                });
                return Promise.all(promises);
            }
        });
    },
    migrateMatchPredictions: function () {
        return MatchPrediction.find({}, function (err, matchPredictions) {
            if (matchPredictions) {
                const promises = matchPredictions.map(function (matchPrediction) {
                    return MatchPrediction.findOneAndUpdate({_id: matchPrediction._id}, matchPrediction, utils.updateSettings);
                });
                return Promise.all(promises);
            }
        });
    },
    migrateMatchResults: function () {
        return MatchResult.find({}, function (err, matchResults) {
            if (matchResults) {
                const promises = matchResults.map(function (matchResult) {
                    return MatchResult.findOneAndUpdate({_id: matchResult._id}, matchResult, utils.updateSettings);
                });
                return Promise.all(promises);
            }
        });
    },
    migrateTeamPredictions: function () {
        return TeamPrediction.find({}, function (err, teamPredictions) {
            if (teamPredictions) {
                const promises = teamPredictions.map(function (teamPrediction) {
                    return TeamPrediction.findOneAndUpdate({_id: teamPrediction._id}, teamPrediction, utils.updateSettings);
                });
                return Promise.all(promises);
            }
        });
    },
    migrateTeamResults: function () {
        return TeamResult.find({}, function (err, teamResults) {
            if (teamResults) {
                const promises = teamResults.map(function (teamResult) {
                    return TeamResult.findOneAndUpdate({_id: teamResult._id}, teamResult, utils.updateSettings);
                });
                return Promise.all(promises);
            }
        });
    },
    migrateUsers: function () {
        return User.find({}, function (err, users) {
            if (users) {
                const promises = users.map(function (user) {
                    //
                });
                return Promise.all(promises);
            }
        });
    },
    removePush: function () {
        UserSettings.remove({}).then(function () {
            pushSubscription.remove({}).then(function () {

            });
        });
    },
    getTeamStats: function () {
        TeamPrediction.find({groupId: utils.WORLD_CUP_GROUP}).then(function (teamsPredictions) {
            var results = {};
            teamsPredictions.forEach(function (teamsPrediction) {
                if (!results.hasOwnProperty(teamsPrediction.teamId)) {
                    results[teamsPrediction.teamId] = {};
                }

                if (!results[teamsPrediction.teamId].hasOwnProperty(teamsPrediction.team)) {
                    results[teamsPrediction.teamId][teamsPrediction.team] = 0;
                }
                results[teamsPrediction.teamId][teamsPrediction.team]++;
            });

            //console.log(results);
        });
    },
    whoDidntFill: function () {
        Group.find({_id: utils.WORLD_CUP_GROUP}).then(function (groups) {
            var userIds = groups[0].users;
            var matchIds = ["5a21a7c1a3f89181074e9762", "5a21a7c1a3f89181074e9763", "5a21a7c1a3f89181074e9768", "5a21a7c1a3f89181074e9769"];
            MatchPrediction.find({userId: {$in: userIds}, matchId: {$in: matchIds}}).then(function (matchPredictions) {
                var existFill = {};
                matchPredictions.forEach(function (matchPrediction) {
                    if (!existFill.hasOwnProperty(matchPrediction.matchId)) {
                        existFill[matchPrediction.matchId] = [];
                    }
                    if (existFill[matchPrediction.matchId].indexOf(matchPrediction.userId) < 0) {
                        existFill[matchPrediction.matchId].push(matchPrediction.userId);
                    }
                });

                Object.keys(existFill).forEach(function (matchIdKey) {
                    userIds.forEach(function (userId) {
                        if (existFill[matchIdKey].indexOf(userId) < 0) {
                            console.log('user:' + userId + ', matchId:' + matchIdKey);
                        }
                    });

                });
            });
        });
    },
    whenFill: function () {
        Group.find({_id: utils.WORLD_CUP_GROUP}).then(function (groups) {

            var userIds = groups[0].users;
            User.find({_id: {$in: userIds}}).then(function (users) {
                var matchIds = ["5a21a7c1a3f89181074e976c", "5a21a7c1a3f89181074e976d"];
                var results = {};
                MatchPrediction.find({groupId: groups[0]._id, userId: {$in: userIds}, matchId: {$in: matchIds}}).then(function (matchPredictions) {
                    matchPredictions.forEach(function (matchPrediction) {
                        if (matchPrediction.isRandom){
                            var relevantUser = users.filter(function (aUser) {
                               return aUser._id.toString() === matchPrediction.userId.toString();
                            });
                            if (!results.hasOwnProperty(relevantUser[0].name)){
                                results[relevantUser[0].name] = [];
                            }
                            results[relevantUser[0].name].push(matchPrediction.matchId);
                        }
                    });

                    console.log(results);
                });
            });
        });
    }
};