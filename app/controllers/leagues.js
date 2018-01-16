const express = require('express');
const app = express.Router();
const League = require('../models/league');
const Group = require('../models/group');
const util = require('../utils/util.js');

app.get('/:leagueId', util.isLoggedIn, function (req, res) {
	const leagueId = req.params.leagueId;
	if (!leagueId) {
		res.status(500).json(util.getErrorResponse('provide leagueId'));
		return;
	}

	const userId = req.user._id;
	return Promise.all([
		Group.find({users: userId, leagueIds: leagueId})
	]).then(function (groups) {
		if (groups[0]) {
			return League.findOne({_id: leagueId}, function (err, relevantLeague) {
				if (err) {
					res.status(500).json(util.getErrorResponse('error'));
				} else {
					res.status(200).json(relevantLeague);
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
			let mergedLeagueIds = [].concat.apply([], leagueIdsArr);
			return League.find({_id: {$in: mergedLeagueIds}}, function (err, relevantLeagues) {
				if (err) {
					res.status(500).json(util.getErrorResponse('error'));
				} else {
					res.status(200).json(relevantLeagues);
				}
			});
		} else {
			return [];
		}
	});
});

app.get('/allLeagues', util.isLoggedIn, function (req, res) {
	League.find({}, function (err, obj) {
		if (err || !obj) {
			res.status(403).json(util.getErrorResponse('error'));
		} else {
			res.status(200).json(obj);
		}
	});
});

module.exports = app;