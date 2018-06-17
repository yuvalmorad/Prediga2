const express = require('express');
const app = express.Router();
const usersLeaderboardService = require('../services/usersLeaderboardService');
const util = require('../utils/util');
const groupService = require('../services/groupService');

/**
 * Reset leaderboard
 */
app.get('/reset/:leagueId', util.isAdmin, function (req, res) {
    const leagueId = req.params.leagueId;
    return usersLeaderboardService.resetLeaderboard(leagueId).then(function () {
        console.log('finish reset');
        res.status(200).json();
    });
});

/**
 * activate/deactivate user in group (under all leagues)
 */
app.post('/:groupId/setActiveUser/:userId/:activate', util.isLoggedIn, function (req, res) {
    const userId = req.user._id,
        userIdToActivate = req.params.userId,
        isActive = req.params.activate === "true",
        groupId = req.params.groupId;

    if (!userIdToActivate || !groupId) {
        res.status(400).json({});
        return;
    }

    return groupService.byId(groupId).then(function (group) {
        if (group.createdBy !== userId.toString()) {
            res.status(403).json({});
            return;
        }

        return usersLeaderboardService.updateIsActiveUser(userIdToActivate, groupId, isActive).then(function () {
            res.status(200).json({});
        });
    });
});
/**
 * Get leaderboards, Only relevant to logged in users's group
 */
app.get('/', util.isLoggedIn, function (req, res) {
    const userId = req.user._id;
    let groupId = req.query.groupId;
    if (!groupId || groupId === 'undefined') {
        groupId = util.DEFAULT_GROUP;
    }

    return groupService.byUserIdAndId(userId, groupId).then(function (group) {
        if (!group) {
            res.status(200).json([]);
            return;
        }
        return usersLeaderboardService.getLeaderboardWithNewRegisteredUsers(group.leagueIds, group.users, group._id).then(function (leaderboards) {
            res.status(200).json(leaderboards);
        });
    });
});

module.exports = app;