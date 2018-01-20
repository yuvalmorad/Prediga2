const express = require('express');
const app = express.Router();
const matchResultService = require('../services/matchResultService');
const util = require('../utils/util.js');

/**
 * All
 */
app.get('/', util.isLoggedIn, function (req, res) {
	return matchResultService.all().then(function (matchResults) {
		res.status(200).json(matchResults);
	});
});

/**
 * By Match Id
 */
app.get('/:matchId', util.isLoggedIn, function (req, res) {
	const matchId = req.params.matchId;
	if (!matchId) {
		res.status(400).json(util.getErrorResponse());
		return;
	}
	return matchResultService.byMatchId(matchId).then(function (matchResult) {
		if (!matchResult) {
			res.status(200).json({});
		} else {
			res.status(200).json(matchResult);
		}
	});
});

module.exports = app;