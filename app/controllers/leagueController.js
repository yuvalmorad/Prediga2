const express = require('express');
const app = express.Router();
const leagueService = require('../services/leagueService');
const groupService = require('../services/groupService');
const util = require('../utils/util.js');

/**
 * All leagues
 * No matter the logged in user
 */
app.get('/all', util.isLoggedIn, function (req, res) {
	return leagueService.all().then(function (leagues) {
		res.status(200).json(leagues);
	});
});

/**
 * By Id, only if user is part of.
 */
app.get('/:leagueId', util.isLoggedIn, function (req, res) {
	const leagueId = req.params.leagueId;
	if (!leagueId) {
		res.status(400).json(util.getErrorResponse());
		return;
	}

	const userId = req.user._id;
	return groupService.byUserIdAndLeagueId(userId, leagueId).then(function (groups) {
		if (!groups) {
			res.status(200).json([]);
			return;
		}
		return leagueService.byId(leagueId).then(function (league) {
			res.status(200).json(league);
		});
	});
});

/**
 * All, only if user is part of.
 */
app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	return groupService.byUserId(userId).then(function (groups) {
		if (!groups) {
			res.status(200).json([]);
			return;
		}
		let leagueIds = groupService.getLeagueIdMap(groups);
		return leagueService.byIds(leagueIds).then(function (leagues) {
			res.status(200).json(leagues);
		});
	});
});

module.exports = app;