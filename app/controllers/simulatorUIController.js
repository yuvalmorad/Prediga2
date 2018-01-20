const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const groupService = require('../services/groupService');
const leagueService = require('../services/leagueService');
const matchService = require('../services/matchService');
const matchResultService = require('../services/matchResultService');
const matchPredictionsService = require('../services/matchPredictionsService');

/**
 * Get data for Simulator screen
 */
app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	let groupId = req.query.groupId;
	if (!groupId || groupId === 'undefined') {
		groupId = util.DEFAULT_GROUP;
	}

	getData(groupId, userId).then(function (simulatorCombined) {
		res.status(200).json(simulatorCombined);
	});
});

function getData(groupId, userId) {
	return groupService.byUserIdAndId(userId.toString(), groupId).then(function (group) {
		if (!group) {
			return Promise.resolve([]);
		}
		return leagueService.byIds(group.leagueIds).then(function (leagues) {
			const leagueIds = leagueService.getIdArr(leagues);
			return matchService.byLeagueIds(leagueIds).then(function (matches) {
				const matchIds = matchService.getIdArr(matches);
				return matchResultService.byMatchIdsAndAndActiveStatus(matchIds, true).then(function (inProgressMatchResults) {
					const inProgressMatchIds = matchResultService.getMatchIdsArr(inProgressMatchResults);
					return matchService.byIds(inProgressMatchIds).then(function (inProgressMatches) {
						return matchPredictionsService.byGroupIdAndMatches(groupId, inProgressMatches).then(function (predictions) {
							return {
								matches: inProgressMatches,
								predictions: predictions
							}
						});
					});
				});
			});
		});
	});
}

module.exports = app;