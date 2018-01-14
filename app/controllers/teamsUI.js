const express = require('express');
const app = express.Router();
const Team = require('../models/team');
const teamPredictionsService = require('../services/teamPredictionsService');
const util = require('../utils/util.js');
const TeamResult = require('../models/teamResult');
const League = require('../models/league');
const Group = require('../models/group');

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
	return Promise.all([
		Group.findOne({_id: groupId, users: me})
	]).then(function (group) {
		if (group) {
			let leagueIds = group[0].leagueIds;
			return Promise.all([
				League.find({_id: {$in: leagueIds}})
			]).then(function (arr2) {
				const leagueIds = arr2[0].map(function (league) {
					return league._id;
				});

				return Promise.all([
					Team.find({league: {$in: leagueIds}})
				]).then(function (arr1) {
					const teams = arr1[0];
					const teamIds = arr1[0].map(function (team) {
						return team._id;
					});

					const predictionRequest = {
						userId: me,
						isForMe: true,
						me: me,
						groupId: groupId,
						teamIds: teamIds
					};

					return Promise.all([
						teamPredictionsService.getPredictionsByUserId(predictionRequest),
						TeamResult.find({teamId: {$in: teamIds}})
					]).then(function (arr) {
						return {
							teams: teams,
							predictions: arr[0],
							results: arr[1]
						}
					});
				});
			});
		} else {
			return {
				teams: [],
				predictions: [],
				results: []
			}
		}

	});
}

module.exports = app;