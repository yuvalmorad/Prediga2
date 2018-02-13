const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const groupService = require('../services/groupService');
const leagueService = require('../services/leagueService');
const matchService = require('../services/matchService');
const matchResultService = require('../services/matchResultService');
const matchPredictionsService = require('../services/matchPredictionsService');
const teamService = require('../services/teamService');
const teamPredictionsService = require('../services/teamPredictionsService');
const teamResultService = require('../services/teamResultService');

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
					let inProgressMatchIds = matchResultService.getMatchIdsArr(inProgressMatchResults);
					return matchService.byIds(inProgressMatchIds).then(function (inProgressMatches) {
						return matchPredictionsService.byGroupIdAndMatches(groupId, inProgressMatches).then(function (predictions) {
							return teamService.byLeagueIds(leagueIds).then(function (teams) {
								const teamIds = teamService.getIdsArr(teams);
								return teamResultService.byTeamIds(teamIds).then(function (endedTeamsResults) {
									const endedTeamsResultIds = teamResultService.getTeamIdsArr(endedTeamsResults);
									return teamService.byIds(endedTeamsResultIds).then(function (endedTeams) {
										return teamPredictionsService.byGroupIdAndTeams(groupId, endedTeams).then(function (teamPredictions) {
											return {
												matches: inProgressMatches,
												predictions: predictions,
												teamPredictions: teamPredictions,
												teams: teams
											}
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
}

module.exports = app;