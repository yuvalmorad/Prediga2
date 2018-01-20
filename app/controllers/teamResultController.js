const express = require('express');
const app = express.Router();
const teamResultService = require('../services/teamResultService');
const util = require('../utils/util.js');

/**
 * All
 */
app.get('/', util.isLoggedIn, function (req, res) {
	return teamResultService.all().then(function (teamResults) {
		res.status(200).json(teamResults);
	});
});

/**
 * By team Id
 */
app.get('/:teamId', util.isLoggedIn, function (req, res) {
	const teamId = req.params.teamId;
	if (!teamId) {
		res.status(400).json(util.getErrorResponse());
		return;
	}
	return teamResultService.byTeamId(teamId).then(function (teamResult) {
		if (!teamResult) {
			res.status(200).json({});
		} else {
			res.status(200).json(teamResult);
		}
	})
});
module.exports = app;