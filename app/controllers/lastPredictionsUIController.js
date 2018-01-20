const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const matchService = require('../services/matchService');
const matchPredictionsService = require('../services/matchPredictionsService');
const matchResultService = require('../services/matchResultService');
const userService = require('../services/userService');

/**
 * Get data for Single User Last Prediction screen
 */
app.get('/:userId', util.isLoggedIn, function (req, res) {
	const requestUserId = req.params.userId;
	const leagueId = req.query.leagueId;
	if (!leagueId) {
		res.status(400).json({});
	}
	let groupId = req.query.groupId;
	if (!groupId || groupId === 'undefined') {
		groupId = util.DEFAULT_GROUP;
	}
	const loggedInUser = req.user._id;

	getData({
		userId: requestUserId,
		isForMe: userService.isMe(loggedInUser, requestUserId),
		me: loggedInUser,
		groupId: groupId,
		leagueId: leagueId
	}).then(function (obj) {
		res.status(200).json(obj);
	});
});

function getData(request) {
	let emptyObj = {
		predictions: [],
		results: [],
		matches: []
	};
	return matchPredictionsService.getPredictionsByUserId(request).then(function (userPredictions) {
		if (!userPredictions) {
			return Promise.resolve(emptyObj);
		}
		const matchIds = matchPredictionsService.getMatchIdsArr(userPredictions);
		return matchResultService.byMatchIds(matchIds).then(function (matchResults) {
			if (!matchResults) {
				return Promise.resolve(emptyObj);
			}
			const finishedMatchIds = matchResultService.getMatchIdsArr(matchResults);
			const userPredictionsFinished = userPredictions.filter(function (prediction) {
				return finishedMatchIds.indexOf(prediction.matchId) >= 0;
			});

			return matchService.byLeagueIdAndIdsWithLimit(request.leagueId, finishedMatchIds, util.LAST_PREDICTIONS_LIMIT_UI).then(function (finishedMatches) {
				if (!finishedMatches) {
					return emptyObj;
				} else {
					return {
						predictions: userPredictionsFinished,
						results: matchResults,
						matches: finishedMatches
					};
				}
			});
		});
	});
}

module.exports = app;