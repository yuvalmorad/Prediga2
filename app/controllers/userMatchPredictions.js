const express = require('express');
const app = express.Router();
const Match = require('../models/match');
const matchPredictionsService = require('../services/matchPredictionsService');
const util = require('../utils/util.js');
const MatchResult = require('../models/matchResult');

app.get('/:userId', util.isLoggedIn, function (req, res) {
	const userId = req.params.userId;
	const leagueId = req.query.leagueId;
	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}
	const user = req.user;
	const request = {
		userId: userId,
		isForMe: user._id.toString() === userId || typeof(userId) === 'undefined',
		me: user._id,
		groupId: groupId,
		leagueId: leagueId
	};

	getData(request).then(function (obj) {
		res.status(200).json(obj);
	});
});

function getData(request) {
	// TODO - improve this method in performance
	return Promise.all([
		matchPredictionsService.getPredictionsByUserId(request)

	]).then(function (arr) {
		const predictionsMatchIds = arr[0].map(function (prediction) {
			return prediction.matchId;
		});

		return Promise.all([
			MatchResult.find({matchId: {$in: predictionsMatchIds}, active: false})
		]).then(function (arr2) {
			const relevantMatchIds = arr2[0].map(function (prediction) {
				return prediction.matchId;
			});
			const predictionsFiltered = arr[0].filter(function (prediction) {
				return relevantMatchIds.indexOf(prediction.matchId) >= 0;
			});
			return Promise.all([
				typeof (request.leagueId) !== 'undefined' ?
					Match.find({
						_id: {$in: relevantMatchIds},
						league: request.leagueId
					}).sort({'kickofftime': -1}).limit(6) :
					Match.find({_id: {$in: relevantMatchIds}}).sort({'kickofftime': -1}).limit(6)
			]).then(function (arr3) {
				const isMatchesExist = !!(arr3[0] && arr3[0].length > 0);
				return {
					predictions: isMatchesExist ? predictionsFiltered : [],
					results: isMatchesExist ? arr2[0] : [],
					matches: arr3[0]
				};
			});
		});
	});
}

module.exports = app;