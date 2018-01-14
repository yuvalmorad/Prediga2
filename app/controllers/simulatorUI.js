const express = require('express');
const app = express.Router();
const matchService = require('../services/matchService');
const matchPredictionsService = require('../services/matchPredictionsService');
const util = require('../utils/util.js');
const leagueService = require('../services/leagueService');

app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	getData(groupId, userId).then(function (simulatorCombined) {
		res.status(200).json(simulatorCombined);
	});
});

function getData(groupId, userId) {
	return Promise.all([
		leagueService.getMatchesByGroupId(groupId, userId)
	]).then(function (arr2) {
		const matchIds = arr2[0].map(function (match) {
			return match._id;
		});

		return Promise.all([
			matchService.findMatchesThatAreClosedAndNotFinished(matchIds)
		]).then(function (arr) {
			return matchPredictionsService.findPredictionsByMatchIds(groupId, arr[0]).then(function (predictions) {
				return {
					matches: arr[0],
					predictions: predictions
				}
			});
		});
	});


}

module.exports = app;