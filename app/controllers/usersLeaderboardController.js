const express = require('express');
const app = express.Router();
const usersLeaderboardService = require('../services/usersLeaderboardService');
const util = require('../utils/util');
const groupService = require('../services/groupService');

/**
 * Reset leaderboard
 */
app.get('/reset', util.isAdmin, function (req, res) {
	return usersLeaderboardService.resetLeaderboard().then(function () {
		console.log('finish reset');
		res.status(200).json();
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