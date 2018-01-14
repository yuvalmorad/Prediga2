const express = require('express');
const app = express.Router();
const matchPredictionsService = require('../services/matchPredictionsService');
const util = require('../utils/util.js');
const groupConfigurationService = require('../services/groupConfigurationService');

app.get('/:userId', util.isLoggedIn, function (req, res) {
	const userId = req.params.userId;

	if (!userId) {
		res.status(403).json(util.getErrorResponse('provide userId'));
		return;
	}

	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	const user = req.user;

	const predictionRequest = {
		userId: userId,
		isForMe: user._id.toString() === userId || typeof(userId) === 'undefined',
		me: user._id,
		groupId: groupId
	};
	matchPredictionsService.getPredictionsByUserId(predictionRequest).then(function (result) {
		res.status(200).json(result);
	});
});

app.get('/:matchId', util.isLoggedIn, function (req, res) {
	const matchId = req.params.matchId;
	if (!matchId) {
		res.status(403).json(util.getErrorResponse('provide matchId'));
		return;
	}

	const user = req.user;
	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	const predictionRequest = {
		isForMe: user._id.toString() === userId || typeof(userId) === 'undefined',
		matchIds: [matchId],
		groupId: groupId
	};

	matchPredictionsService.getPredictionsByMatchIds(predictionRequest).then(function (result) {
		res.status(200).json(result);
	});
});

app.get('/', util.isLoggedIn, function (req, res) {
	const user = req.user;

	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	const predictionRequest = {
		userId: undefined,
		isForMe: false,
		me: user._id,
		groupId: groupId
	};

	matchPredictionsService.getPredictionsByUserId(predictionRequest).then(function (result) {
		res.status(200).json(result);
	});
});

app.post('/', util.isLoggedIn, function (req, res) {
	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	const matchPredictions = req.body.matchPredictions;
	if (!matchPredictions || !Array.isArray(matchPredictions)) {
		res.status(500).json(util.getErrorResponse('provide array of matchPredictions'));
		return;
	}
	const userId = req.user._id;

	groupConfigurationService.getConfigurationValue(groupId, 'minutesBeforeCloseMathPrediction').then(function (value) {
		return matchPredictionsService.createMatchPredictions(groupId, matchPredictions, userId, value).then(function (obj) {
			res.status(200).json(obj);
		}, function (msg) {
			res.status(500).json({error: msg});
		});
	});
});

module.exports = app;