const express = require('express');
const app = express.Router();
const teamPredictionsService = require('../services/teamPredictionsService');
const userService = require('../services/userService');
const util = require('../utils/util.js');

/**
 * All team Predictions, Only relevant to logged in users's group
 */
app.get('/', util.isLoggedIn, function (req, res) {
	const user = req.user;

	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	return teamPredictionsService.getPredictionsByUserId({
		userId: undefined,
		isForMe: false,
		me: user._id,
		groupId: groupId,
		teamIds: undefined
	}).then(function (result) {
		res.status(200).json(result);
	});
});

/**
 * By User Id
 */
app.get('/:userId', util.isLoggedIn, function (req, res) {
	const userId = req.params.userId;
	const user = req.user;

	if (!userId) {
		res.status(400).json(util.getErrorResponse());
		return;
	}

	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	return teamPredictionsService.getPredictionsByUserId({
		userId: userId,
		isForMe: userService.isMe(user._id, userId),
		me: user._id,
		groupId: groupId,
		teamIds: undefined
	}).then(function (result) {
		res.status(200).json(result);
	});
});

/**
 * Create/Update team prediction
 */
app.post('/', util.isLoggedIn, function (req, res) {
	const teamPredictions = req.body.teamPredictions;
	if (!teamPredictions || !Array.isArray(teamPredictions)) {
		res.status(400).json(util.getErrorResponse());
		return;
	}
	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	const userId = req.user._id;
	return teamPredictionsService.createTeamPredictions(groupId, teamPredictions, userId).then(function (newPrediction) {
		res.status(200).json(newPrediction);
	}, function (msg) {
		res.status(500).json({error: msg});
	});
});

module.exports = app;