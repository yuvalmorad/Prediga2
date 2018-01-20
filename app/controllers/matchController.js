const express = require('express');
const app = express.Router();
const matchService = require('../services/matchService');
const util = require('../utils/util.js');

/**
 * By Id
 */
app.get('/:matchId', util.isLoggedIn, function (req, res) {
	const matchId = req.params.matchId;
	if (!matchId) {
		res.status(400).json(util.getErrorResponse());
		return;
	}
	return matchService.byId(matchId).then(function (match) {
		res.status(200).json(match);
	});
});

/**
 * All
 */
app.get('/', util.isLoggedIn, function (req, res) {
	return matchService.all().then(function (matches) {
		res.status(200).json(matches);
	});
});

module.exports = app;