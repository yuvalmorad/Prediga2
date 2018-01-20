const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const groupService = require('../services/groupService.js');
const leagueService = require('../services/leagueService.js');
const clubService = require('../services/clubService.js');

/**
 * All Clubs
 * No matter the logged in user
 */
app.get('/all', util.isLoggedIn, function (req, res) {
	return clubService.all().then(function (clubs) {
		res.status(200).json(clubs);
	});
});

/**
 * By Club Id, Only relevant to logged in users's group
 */
app.get('/:clubId', util.isLoggedIn, function (req, res) {
	const clubId = req.params.clubId;
	if (!clubId) {
		res.status(400).json({});
		return;
	}

	const userId = req.user._id;
	return groupService.byUserId(userId).then(function (groups) {
		if (!groups) {
			res.status(200).json({});
			return;
		}
		const leagueIdsArr = groupService.getLeagueIdMap(groups);
		return leagueService.byClubIdAndLeagueIds(clubId, leagueIdsArr).then(function (relevantLeagues) {
			if (!relevantLeagues) {
				res.status(200).json({});
			} else {
				return clubService.byId(clubId).then(function (club) {
					if (!club) {
						res.status(200).json({});
					} else {
						res.status(200).json(club);
					}
				});
			}
		});
	});
});

/**
 * * All Clubs, Only relevant to logged in users's group
 */
app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	return groupService.byUserId(userId).then(function (groups) {
		if (!groups) {
			res.status(400).json([]);
			return;
		}
		const leagueIdsArr = groupService.getLeagueIdMap(groups);
		return leagueService.byIds(leagueIdsArr).then(function (relevantLeagues) {
			if (!relevantLeagues) {
				res.status(200).json([]);
			} else {
				const clubIdsArr = clubService.getClubIdMap(relevantLeagues);
				return clubService.byIds(clubIdsArr).then(function (clubs) {
					if (!clubs) {
						res.status(200).json([]);
					} else {
						res.status(200).json(clubs);
					}
				});
			}
		});
	});
});

module.exports = app;