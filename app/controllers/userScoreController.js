const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const userScoreService = require('../services/userScoreService');

/**
 * All
 */
app.get('/', util.isAdmin, function (req, res) {
	return userScoreService.all().then(function (userScores) {
		res.status(200).json(userScores);
	});
});

module.exports = app;