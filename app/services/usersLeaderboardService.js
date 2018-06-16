const groupService = require('../services/groupService');
const leagueService = require('../services/leagueService');
const userScoreService = require('../services/userScoreService');
const matchService = require('../services/matchService');
const matchResultService = require('../services/matchResultService');
const teamService = require('../services/teamService');
const teamResultService = require('../services/teamResultService');
const UsersLeaderboard = require('../models/usersLeaderboard');
const utils = require('../utils/util');

const self = module.exports = {
    resetLeaderboard: function () {
        return UsersLeaderboard.remove({}).then(function () {
            return leagueService.all().then(function (leagues) {
                const promises = leagues.map(function (league) {
                    const leagueId = league._id;
                    return Promise.all([
                        matchService.byLeagueIds([leagueId]),
                        teamService.byLeagueIds([leagueId])
                    ]).then(function (staticGames) {
                        const matchIds = matchService.getIdArr(staticGames[0]);
                        const teamIds = teamService.getIdsArr(staticGames[1]);

                        return Promise.all([
                            matchResultService.byMatchIdsAndAndActiveStatus(matchIds, false),
                            teamResultService.byTeamIds(teamIds)
                        ]).then(function (results) {
                            let combinedResults = utils.mergeArr(results);
                            combinedResults.sort(self.compareResultsAsc);
                            const gameIds = combinedResults.map(function (result) {
                                return result.matchId || result.teamId;
                            });
                            if (gameIds.length < 0) {
                                return Promise.resolve({});
                            }
                            return self.updateLeaderboardByGameIds(leagueId, gameIds).then(function () {
                                //console.log('[Leaderboard] - Finish updateLeaderboardByGameIds');
                                return Promise.resolve({});
                            });
                        });
                    });
                });
                return Promise.all(promises);
            })
        });
    },
    updateLeaderboardByGameIds: function (leagueId, gameIds) {
        return groupService.byLeagueId(leagueId).then(function (groups) {
            const promises = groups.map(function (group) {
                self.byLeagueIdGroupId(leagueId, group._id).then(function (leaderboards) {
                    utils.processEachItemSynchronic(self.updateLeaderboardForGameId, gameIds, {
                        leaderboards: leaderboards,
                        leagueId: leagueId,
                        groupId: group._id
                    });
                    return Promise.resolve();
                });
            });
            return Promise.all(promises);
        });
    },
    updateLeaderboardForGameId: function (input, gameId) {
        //console.log('Beginning to update leaderboard game: ' + index);
        return userScoreService.byLeagueIdGameIdGroupId(input.leagueId.toString(), gameId.toString(), input.groupId).then(function (userScores) {
            if (!userScores || userScores < 1) {
                return Promise.resolve({});
            }

            // console.log('Beginning to append (step 1) game');
            userScores.forEach(function (newUserScore) {
                self.appendUserScoreToLeaderboard(newUserScore, input.leaderboards);
            });

            // console.log('Beginning to sort (step 2) game');
            input.leaderboards.sort(self.compareAggregatedScores);

            // fix places & update
            // console.log('Beginning to update (step 3) game');
            const promises = (input.leaderboards || []).map(function (leaderboardItem, index) {
                return self.updateLeaderboardItem(leaderboardItem, index, input.leaderboards);
            });

            return Promise.all(promises);
        });
    },
    updateLeaderboardItem: function (leaderboardItem, index, leaderboards) {
        // fix places
        let placeBeforeLastGame = -1;
        if (typeof(leaderboardItem.placeCurrent) !== 'undefined') {
            placeBeforeLastGame = leaderboardItem.placeCurrent;
        }
        leaderboardItem.placeBeforeLastGame = placeBeforeLastGame;

        // if the item has the same score as above, then he has the same place...
        if (leaderboards.length > 0 && index > 0 && leaderboards[index - 1].score === leaderboards[index].score) {
            leaderboardItem.placeCurrent = leaderboards[index - 1].placeCurrent;
        } else {
            if (index > 0) {
                leaderboardItem.placeCurrent = leaderboards[index - 1].placeCurrent + self.countOfUsersWithTheSameScore(leaderboards, leaderboards[index - 1].score);
            } else {
                leaderboardItem.placeCurrent = 1;
            }
        }
        leaderboardItem.placesOverMatches.push(leaderboardItem.placeCurrent);

        // update
        return UsersLeaderboard.findOneAndUpdate({
            groupId: leaderboardItem.groupId,
            userId: leaderboardItem.userId,
            leagueId: leaderboardItem.leagueId
        }, leaderboardItem, utils.updateSettings);
    },
    appendUserScoreToLeaderboard: function (userScore, leaderboards) {
        /*if (userScore.userId === '5a66566fb3d162001584a295' && userScore.groupId === '5a3eac97d3ca76dbd12bf638' && userScore.leagueId === '1a21a7c1a3f89181074e9769'){
            console.log(userScore.score);
        }*/
        const leaderboardItemForUser = self.filterByUserId(leaderboards, userScore.userId);

        if (leaderboardItemForUser.length < 1) {
            leaderboards.push({
                groupId: userScore.groupId,
                leagueId: userScore.leagueId,
                userId: userScore.userId,
                score: userScore.score,
                strikes: userScore.strikes,
                placeCurrent: -1,
                placeBeforeLastGame: -1,
                placesOverMatches: []
            });
        } else {
            leaderboardItemForUser[0].score += userScore.score;
            leaderboardItemForUser[0].strikes += userScore.strikes;
        }
    },
    compareAggregatedScores: function (a, b) {
        if (a.score < b.score)
            return 1;
        if (a.score > b.score)
            return -1;
        if (a.userId < b.userId)
            return 1;
        if (a.userId > b.userId)
            return -1;
        return 0;
    },
    compareUserIds: function (a, b) {
        if (a < b)
            return 1;
        if (a > b)
            return -1;
        return 0;
    },
    compareResultsAsc: function (a, b) {
        if (a.resultTime > b.resultTime)
            return 1;
        if (a.resultTime < b.resultTime)
            return -1;
        return 0;
    },
    getLeaderboardWithNewRegisteredUsers: function (leagueIds, allUsers, groupId) {
        return leagueService.byIds(leagueIds).then(function (leagues) {
            const promises = leagues.map(function (league) {
                return self.byLeagueIdGroupId(league._id, groupId).then(function (leaderboards) {
                    leaderboards.sort(self.compareAggregatedScores);
                    return self.amendNewRegisteredUsers(leaderboards, allUsers, league._id, groupId).then(function (leaderboardItems) {
                        return Promise.resolve(leaderboardItems);
                    });
                });
            });
            return Promise.all(promises);
        });
    },
    amendNewRegisteredUsers: function (leaderboards, allUsers, leagueId, groupId) {
        const userIdsInLeaderboard = leaderboards.map(a => a.userId.toString());
        const usersNotExists = allUsers.filter(x => userIdsInLeaderboard.indexOf(x.toString()) === -1);
        if (!usersNotExists || usersNotExists.length < 1) {
            return Promise.resolve(leaderboards);
        }

        usersNotExists.sort(self.compareUserIds);
        const promises = usersNotExists.map(function (usersNotExist) {
            return self.amendNewRegisteredUser(leaderboards, usersNotExist, leagueId, groupId);
        });
        return Promise.all(promises);
    },
    amendNewRegisteredUser: function (leaderboards, userId, leagueId, groupId) {
        let leaderboardItem = {
            groupId: groupId,
            leagueId: leagueId,
            userId: userId,
            score: 0,
            strikes: 0,
            placeCurrent: -1,
            placeBeforeLastGame: -1,
        };
        return UsersLeaderboard.findOneAndUpdate({
            groupId: groupId,
            userId: userId,
            leagueId: leagueId
        }, leaderboardItem, utils.updateSettings);
    },
    removeByGroupId: function (groupId) {
        return UsersLeaderboard.remove({groupId: groupId});
    },
    removeByGroupIdLeagueId: function (groupId, leagueId) {
        return UsersLeaderboard.remove({groupId: groupId, leagueId: leagueId});
    },
    removeByGroupIdAndUserId: function (groupId, userId) {
        return UsersLeaderboard.remove({groupId: groupId, userId: userId});
    },
    byLeagueIdGroupId: function (leagueId, groupId) {
        return UsersLeaderboard.find({leagueId: leagueId, groupId: groupId});
    },
    filterByUserId: function (leaderboards, userId) {
        return leaderboards.filter(function (leaderboardItem) {
            return leaderboardItem.userId === userId;
        });
    },
    updateIsActiveUser: function (userId, groupId, isActive) {
        //update is active user for all leagues under groupId
        return UsersLeaderboard.update({
            groupId: groupId,
            userId: userId
        }, {isActive: isActive}, {upsert: true, multi: true});
    },
    countOfUsersWithTheSameScore: function (leaderboards, score) {
        var count = 0;
        if (leaderboards && leaderboards.length > 0){
            leaderboards.forEach(function (leaderBoardItem) {
                if (leaderBoardItem.score === score) {
                    count++;
                }
            });
        }

        return count;
    }
};