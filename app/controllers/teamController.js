const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const teamService = require('../services/teamService');

/**
 * By Id
 */
app.get('/:teamId', util.isLoggedIn, function (req, res) {
	const teamId = req.params.teamId;
	if (!teamId) {
		res.status(400).json(util.getErrorResponse());
		return;
	}
	return teamService.byId(teamId).then(function (team) {
		res.status(200).json(team);
	});
});

/**
 * All
 */
app.get('/', util.isLoggedIn, function (req, res) {
	return teamService.all().then(function (teams) {
		res.status(200).json(teams);
	});
});

module.exports = app;