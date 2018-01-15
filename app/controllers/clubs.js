const express = require('express');
const app = express.Router();
const Club = require('../models/club');
const League = require('../models/league');
const Group = require('../models/group');
const util = require('../utils/util.js');

app.get('/:clubId', util.isLoggedIn, function (req, res) {
	const clubId = req.params.clubId;
	if (!clubId) {
		res.status(500).json(util.getErrorResponse('provide clubId'));
		return;
	}

	const userId = req.user._id;
	return Promise.all([
		Group.find({users: userId})
	]).then(function (groups) {
		if (groups[0]) {
			const leagueIdsArr = groups[0].map(function (group) {
				return group.leagueIds;
			});
			let mergedLeagueIdsArr = [].concat.apply([], leagueIdsArr);
			return League.find({_id: {$in: mergedLeagueIdsArr, clubs: clubId}}, function (err, relevantLeagues) {
				if (err) {
					res.status(500).json(util.getErrorResponse('error'));
				} else {
					return Club.findOne({_id: clubId}, function (err, clubs) {
						if (err) {
							res.status(403).json(util.getErrorResponse(err.message));
						} else {
							res.status(200).json(clubs);
						}
					});
				}
			});
		} else {
			return [];
		}
	});
});

app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	return Promise.all([
		Group.find({users: userId})
	]).then(function (groups) {
		if (groups[0]) {
			const leagueIdsArr = groups[0].map(function (group) {
				return group.leagueIds;
			});
			let mergedLeagueIdsArr = [].concat.apply([], leagueIdsArr);
			return League.find({_id: {$in: mergedLeagueIdsArr}}, function (err, relevantLeagues) {
				if (err) {
					res.status(500).json(util.getErrorResponse('error'));
				} else {
					let clubsArr = relevantLeagues.map(function (relevantLeague) {
						return relevantLeague.clubs;
					});
					let mergedClubsArr = [].concat.apply([], clubsArr);
					return Club.find({_id: {$in: mergedClubsArr}}, function (err, clubs) {
						if (err) {
							res.status(403).json(util.getErrorResponse(err.message));
						} else {
							res.status(200).json(clubs);
						}
					});
				}
			});
		} else {
			return [];
		}
	});
});

app.get('/allClubs', util.isLoggedIn, function (req, res) {
	Club.find({}, function (err, obj) {
		if (err || !obj) {
			res.status(403).json(util.getErrorResponse('error'));
		} else {
			res.status(200).json(obj);
		}
	});
});

module.exports = app;