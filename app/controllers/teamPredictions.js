const express = require('express');
const app = express.Router();
const TeamPrediction = require('../models/teamPrediction');
const teamPredictionsService = require('../services/teamPredictionsService');
const util = require('../utils/util.js');

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
		groupId: groupId,
		teamIds: undefined
	};
	teamPredictionsService.getPredictionsByUserId(predictionRequest).then(function (result) {
		res.status(200).json(result);
	});
});

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
		groupId: groupId,
		teamIds: undefined
	};

	teamPredictionsService.getPredictionsByUserId(predictionRequest).then(function (result) {
		res.status(200).json(result);
	});
});

app.post('/', util.isLoggedIn, function (req, res) {
	const teamPredictions = req.body.teamPredictions;
	if (!teamPredictions || !Array.isArray(teamPredictions)) {
		res.status(500).json(util.getErrorResponse('provide teamPredictions'));
		return;
	}
	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	const userId = req.user._id;
	teamPredictionsService.createTeamPredictions(groupId, teamPredictions, userId).then(function (obj) {
		res.status(200).json(obj);
	}, function (msg) {
		res.status(500).json({error: msg});
	});
});

module.exports = app;