const express = require('express');
const app = express.Router();
const UsersLeaderboardService = require('../services/usersLeaderboardService');
const util = require('../utils/util.js');

app.get('/:leagueId', util.isLoggedIn, function (req, res) {
	const leagueId = req.params.leagueId;
	if (!leagueId) {
		res.status(500).json(util.getErrorResponse('provide leagueId'));
		return;
	}
	UsersLeaderboardService.getLeaderboardWithNewRegisteredUsers(leagueId).then(function (leaderboards) {
		res.status(200).json(leaderboards);
	});
});

app.get('/', util.isLoggedIn, function (req, res) {
	UsersLeaderboardService.getLeaderboardWithNewRegisteredUsers().then(function (leaderboards) {
		res.status(200).json(leaderboards);
	});
});

app.post('/', util.isAdmin, function (req, res) {
	UsersLeaderboardService.updateLeaderboard().then(function () {
		res.status(200).json();
	});
});

module.exports = app;