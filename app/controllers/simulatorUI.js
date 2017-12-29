const express = require('express');
const app = express.Router();
const matchService = require('../services/matchService');
const matchPredictionsService = require('../services/matchPredictionsService');
const util = require('../utils/util.js');
const leagueService = require('../services/leagueService');

app.get('/', util.isLoggedIn, function (req, res) {
	getData().then(function (simulatorCombined) {
		res.status(200).json(simulatorCombined);
	});
});

function getData() {
	return Promise.all([
		leagueService.getUsersMatchesByLeagues()
	]).then(function (arr2) {
		const matchIds = arr2[0].map(function (match) {
			return match._id;
		});

		return Promise.all([
			matchService.findMatchesThatAreClosedAndNotFinished(matchIds)
		]).then(function (arr) {
			return matchPredictionsService.findPredictionsByMatchIds(arr[0]).then(function (predictions) {
				return {
					matches: arr[0],
					predictions: predictions
				}
			});
		});
	});


}

module.exports = app;