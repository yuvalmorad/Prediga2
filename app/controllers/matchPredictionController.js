const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const matchPredictionsService = require('../services/matchPredictionsService');
const userService = require('../services/userService');
const groupConfigurationService = require('../services/groupConfigurationService');
const groupService = require('../services/groupService');

/**
 * By User Id
 */
app.get('/:userId', util.isLoggedIn, function (req, res) {
	const userId = req.params.userId;
	let groupId = req.query.groupId;
	const user = req.user;
	if (!userId) {
		res.status(400).json(util.getErrorResponse());
		return;
	}

	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	return matchPredictionsService.getPrerdictionsByUserId({
		userId: userId,
		isForMe: userService.isMe(user._id, userId),
		me: user._id,
		groupId: groupId
	}).then(function (result) {
		res.status(200).json(result);
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

	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	return matchPredictionsService.getPredictionsByUserId({
		isForMe: true,
		matchIds: [matchId],
		groupId: groupId
	}).then(function (result) {
		res.status(200).json(result);
	});
});

/**
 * All match Predictions, Only relevant to logged in users's group
 */
app.get('/', util.isLoggedIn, function (req, res) {
	const user = req.user;

	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	return matchPredictionsService.getPredictionsByUserId({
		userId: undefined,
		isForMe: false,
		me: user._id,
		groupId: groupId
	}).then(function (result) {
		res.status(200).json(result);
	});
});

/**
 * Create/Update match Prediction
 */
app.post('/', util.isLoggedIn, function (req, res) {
	let groupId = req.query.groupId;
	const userId = req.user._id;

	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	const matchPredictions = req.body.matchPredictions;
	if (!matchPredictions || !Array.isArray(matchPredictions)) {
		res.status(400).json(util.getErrorResponse());
		return;
	}

	return groupService.byId(groupId).then(function (group) {
		if (!group){
			res.status(400).json({});
		}

		return groupConfigurationService.getConfigurationValue(group.configurationId, util.MINUTES_BEFORE_START_MATCH_PROPERTY_NAME).then(function (minutesBeforeStartGameDeadline) {
			return matchPredictionsService.createMatchPredictions(groupId, matchPredictions, userId, minutesBeforeStartGameDeadline).then(function (newPrediction) {
				res.status(200).json(newPrediction);
			}, function (msg) {
				res.status(400).json({error: msg});
			});
		});
	});
});

module.exports = app;