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

const self = module.exports = {

    run: function () {
        return Promise.all([
            //self.migrateUserScore(),
            //self.migrateLeaderboard(),
            //self.migrateMatchPredictions(),
            //self.migrateTeamPredictions(),
            //self.migrateUsers(),
            //self.migrateMatchResults()
            //self.migrateTeamResults()
            //self.migrateMatches()
            //self.worldCupWhoFillTeams()
        ]).then(function (arr) {
            console.log('[Init] - Migration finished');
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
                    return UserSettings.findOneAndUpdate({
                        userId: user._id,
                        key: utils.USER_SETTINGS_KEYS.RANDOM_ALL
                    }, {
                        userId: user._id,
                        key: utils.USER_SETTINGS_KEYS.RANDOM_ALL,
                        value: utils.USER_SETTINGS_VALUES.TRUE
                    }).then(function () {
                        return UserSettings.findOneAndUpdate({
                            userId: user._id,
                            key: utils.USER_SETTINGS_KEYS.COPY_ALL_GROUPS
                        }, {
                            userId: user._id,
                            key: utils.USER_SETTINGS_KEYS.COPY_ALL_GROUPS,
                            value: utils.USER_SETTINGS_VALUES.TRUE
                        }).then(function () {
                            return Promise.resolve();
                        });
                    });
                });
                return Promise.all(promises);
            }
        });
    },
    worldCupWhoFillTeams: function () {
        var worldCupGroupId = '5af1f5094652f900152f6249';
        var teamIds = ['5a1342399017dfc4e2faf494', '5a1342399017dfc4e2faf495', '5a1342399017dfc4e2faf496', '5a1342399017dfc4e2faf497', "5a1342399017dfc4e2faf498", "5a1342399017dfc4e2faf499", "5a1342399017dfc4e2faf49a", "5a1342399017dfc4e2faf49b", "5a1342399017dfc4e2faf49c", "5a1342399017dfc4e2faf49d", "5a1342399017dfc4e2faf49e", "5a1342399017dfc4e2faf49f", "5a1342399017dfc4e2faf4a0", "5a1342399017dfc4e2faf4a1", "5a1342399017dfc4e2faf4a2", "5a1342399017dfc4e2faf4a3", "5a1342399017dfc4e2faf4a4", "5a1342399017dfc4e2faf4a5", "5a1342399017dfc4e2faf4a6", "5a1342399017dfc4e2faf4a7"];
        return Group.findOne({_id: worldCupGroupId}, function (error, group) {
            let userIds = group.users;
            return User.find({
                _id: {$in: userIds}
            }, function (err, users) {
                return TeamPrediction.find({
                    userId: {$in: userIds},
                    teamId: {$in: teamIds},
                    groupId: worldCupGroupId
                }, function (err, teamPredictions) {
                    var usersThatFill = [];
                    var usersThatDidntFill = [];
                    users.forEach(function (aUser) {
                        var countPredictionsOfUser = self.getUserTeamPredictionsCount(aUser, teamPredictions);
                        if (countPredictionsOfUser === teamIds.length) {
                            // user fill all
                            usersThatFill.push({name: aUser.name, email: aUser.email});
                        } else {
                            // user didn't fill all
                            usersThatDidntFill.push({name: aUser.name, email: aUser.email});
                        }
                    });
                    console.log('users fill all team predictions:');
                    console.log(usersThatFill);
                    console.log('users Didnt fill all team predictions:');
                    console.log(usersThatDidntFill);
                    return Promise.resolve();
                });
            });

        });
    },
    getUserTeamPredictionsCount: function (aUser, teamPredictions) {
        var count = 0;
        teamPredictions.forEach(function (teamPrediction) {
            if (teamPrediction.userId.toString() === aUser._id.toString()) {
                count++;
            }
        });

        return count;
    }
};