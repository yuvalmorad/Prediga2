const express = require('express');
const app = express.Router();
const TeamPrediction = require('../models/teamPrediction');
const teamPredictionsService = require('../services/teamPredictionsService');
const util = require('../utils/util.js');

app.get('/', util.isLoggedIn, function (req, res) {
	const user = req.user;
	teamPredictionsService.getPredictionsByUserId(undefined, false, user._id).then(function (result) {
		res.status(200).json(result);
	});
});

app.get('/:userId', util.isLoggedIn, function (req, res) {
	const userId = req.params.userId;
	if (!userId) {
		res.status(403).json(util.getErrorResponse('provide userId'));
		return;
	}

	const user = req.user;
	const isForMe = user._id.toString() === userId || typeof(userId) === 'undefined';

	teamPredictionsService.getPredictionsByUserId(userId, isForMe).then(function (result) {
		res.status(200).json(result);
	});
});

app.delete('/:id', util.isAdmin, function (req, res) {
	const id = req.params.id;
	if (!id) {
		res.status(403).json(util.getErrorResponse('provide id'));
		return;
	}
	TeamPrediction.findOneAndRemove({_id: id}, function (err, obj) {
		if (err) {
			res.status(403).json(util.getErrorResponse('error'));
		} else {
			res.status(200).json(util.okResponse);
		}
	});
});

app.post('/', util.isLoggedIn, function (req, res) {
	const teamPredictions = req.body.teamPredictions;
	if (!teamPredictions || !Array.isArray(teamPredictions)) {
		res.status(500).json(util.getErrorResponse('provide teamPredictions'));
		return;
	}
	const userId = req.user._id;
	teamPredictionsService.createTeamPredictions(teamPredictions, userId).then(function (obj) {
		res.status(200).json(obj);
	}, function (msg) {
		res.status(500).json({error: msg});
	});
});

module.exports = app;