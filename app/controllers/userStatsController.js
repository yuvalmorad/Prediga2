const express = require('express');
const app = express.Router();
const userStatsService = require('../services/userStatsService');
const util = require('../utils/util.js');

/**
 * getStatsForUser
 */
app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.query.userId;
	const leagueId = req.query.leagueId;
	const groupId = req.query.groupId;
	return userStatsService.getStatsForUser(userId, leagueId, groupId).then(function (statsResult) {
		res.status(200).json(statsResult);
	});
});

module.exports = app;