const express = require('express');
const app = express.Router();
const Match = require('../models/match');
const matchPredictionService = require('../services/matchPredictionsService');
const util = require('../utils/util.js');
const MatchResult = require('../models/matchResult');
const League = require('../models/league');
const Group = require('../models/group');

app.get('/', util.isLoggedIn, function (req, res) {
	const user = req.user;
	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}

	getData(user._id, groupId).then(function (matchesCombined) {
		res.status(200).json(matchesCombined);
	});
});

function getData(me, groupId) {
	return Promise.all([
		Group.findOne({_id: groupId, users: me})
	]).then(function (group) {
		if (group[0]) {
			let leagueIds = group[0].leagueIds;
			return Promise.all([
				League.find({_id: {$in: leagueIds}})
			]).then(function (arr2) {
				const leagueIds = arr2[0].map(function (league) {
					return league._id;
				});

				return Promise.all([
					Match.find({league: {$in: leagueIds}})
				]).then(function (arr1) {
					const matches = arr1[0];
					const matchIds = matches.map(function (match) {
						return match._id;
					});

					const predictionRequest = {
						userId: me,
						isForMe: true,
						me: me,
						groupId: groupId,
						matchIds: matchIds
					};

					return Promise.all([
						matchPredictionService.getPredictionsByUserId(predictionRequest),
						matchPredictionService.getFutureGamesPredictionsCounters(groupId, matchIds),
						MatchResult.find({matchId: {$in: matchIds}}),
					]).then(function (arr) {
						return {
							matches: matches,
							predictions: arr[0],
							predictionsCounters: arr[1],
							results: arr[2]
						}
					});
				});
			});
		} else {
			return {
				matches: [],
				predictions: [],
				predictionsCounters: [],
				results: []
			}
		}

	});
}

module.exports = app;