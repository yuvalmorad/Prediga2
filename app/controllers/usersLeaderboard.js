const express = require('express');
const app = express.Router();
const UsersLeaderboardService = require('../services/usersLeaderboardService');
const util = require('../utils/util.js');
const Group = require('../models/group.js');

app.get('/reset', util.isAdmin, function (req, res) {
	UsersLeaderboardService.resetLeaderboard().then(function () {
		console.log('finish reset');
		res.status(200).json();
	});
});

// get user leaderboards
app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	Group.findOne({users: userId, _id: groupId}, function (err, group) {
		if (group) {
			UsersLeaderboardService.getLeaderboardWithNewRegisteredUsers(group.leagueIds, group.users, group._id).then(function (leaderboards) {
				res.status(200).json(leaderboards);
			});
		} else {
			res.status(200).json([]);
		}
	});
});

module.exports = app;