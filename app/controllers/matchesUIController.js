const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const matchService = require('../services/matchService');
const matchResultService = require('../services/matchResultService');
const leagueService = require('../services/leagueService');
const groupService = require('../services/groupService.js');
const matchPredictionService = require('../services/matchPredictionsService');

/**
 * Get data for Matches screen
 */
app.get('/', util.isLoggedIn, function (req, res) {
	const user = req.user;
	let groupId = req.query.groupId;
	if (!groupId || groupId === 'undefined') {
		groupId = util.DEFAULT_GROUP;
	}

	getData(user._id, groupId).then(function (matchUIData) {
		res.status(200).json(matchUIData);
	});
});

function getData(me, groupId) {
	return groupService.byUserIdAndId(me, groupId).then(function (group) {
		if (!group) {
			return Promise.resolve({
				matches: [],
				predictions: [],
				predictionsCounters: [],
				results: []
			})
		}
		return leagueService.byIds(group.leagueIds).then(function (leagues) {
			let leagueIdArr = leagueService.getIdArr(leagues);
			return matchService.byLeagueIds(leagueIdArr).then(function (matches) {
				let matchesIdArr = matchService.getIdArr(matches);

				return Promise.all([
					matchPredictionService.getPredictionsByUserId({
						userId: me, isForMe: true, me: me, groupId: groupId, matchIds: matchesIdArr
					}),
					matchPredictionService.getFutureGamesPredictionsCounters(groupId, matchesIdArr),
					matchResultService.byMatchIds(matchesIdArr)
				]).then(function (arr) {
					return {
						matches: matches,
						predictions: arr[0],
						predictionsCounters: arr[1],
						results: arr[2]
					}
				});
			});
		})
	});
}

module.exports = app;