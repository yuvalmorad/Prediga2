const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const teamService = require('../services/teamService');
const teamPredictionsService = require('../services/teamPredictionsService');
const teamResultService = require('../services/teamResultService');
const leagueService = require('../services/leagueService');
const groupService = require('../services/groupService');

/**
 * Get data for Team Predictions screen
 */
app.get('/', util.isLoggedIn, function (req, res) {
	const user = req.user;
	let groupId = req.query.groupId;
	if (!groupId) {
		groupId = util.DEFAULT_GROUP;
	}
	getData(user._id, groupId).then(function (teamsCombined) {
		res.status(200).json(teamsCombined);
	});
});

function getData(me, groupId) {
	return groupService.byUserIdAndId(me, groupId).then(function (group) {
		if (!group) {
			return Promise.resolve({
				teams: [],
				predictions: [],
				results: []
			});
		}
		return leagueService.byIds(group.leagueIds).then(function (leagues) {
			const leagueIds = leagueService.getIdArr(leagues);
			return teamService.byLeagueIds(leagueIds).then(function (teams) {
				const teamIds = teamService.getIdsArr(teams);

				return Promise.all([
					teamPredictionsService.getPredictionsByUserId({
						userId: me, isForMe: true, me: me, groupId: groupId, teamIds: teamIds
					}),
					teamResultService.byTeamIds(teamIds)
				]).then(function (arr) {
					return {
						teams: teams,
						predictions: arr[0],
						results: arr[1]
					}
				});
			});
		})
	});
}

module.exports = app;