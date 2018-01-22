const Match = require('../models/match');
const util = require('../utils/util');

const self = module.exports = {
	updateMatches: function (matches) {
		//console.log('beginning to update ' + matches.length + ' matches');
		const promises = matches.map(function (match) {
			return Match.findOneAndUpdate({_id: match._id}, match, util.overrideSettings).then(function (newMatch) {
					return Promise.resolve(newMatch);
				}
			);
		});
		return Promise.all(promises);
	},
	findFirstMatchByTeamsStarted: function (team1, team2) {
		const startTime = new Date().setHours(new Date().getHours() - 3);
		return Match.findOne({
			kickofftime: {$gte: startTime},
			team1: team1,
			team2: team2
		}).sort({'kickofftime': -1}).limit(1);
	},
	filterIdsByMatchesAlreadyStarted: function (matchIds) {
		if (typeof(matchIds) === 'undefined') {
			return Match.find({kickofftime: {$lt: new Date()}});
		} else {
			return Match.find({kickofftime: {$lt: new Date()}, _id: {$in: matchIds}});
		}
	},
	getNotStartedMatches: function (matchIds) {
		return Match.find({kickofftime: {$gte: new Date()}, _id: {$in: matchIds}});
	},
	byId: function (matchId) {
		return Match.findOne({_id: matchId});
	},
	byIds: function (ids) {
		return Match.find({_id: {$in: ids}});
	},
	all: function () {
		return Match.find({});
	},
	byLeagueIds: function (leagueIds) {
		return Match.find({league: {$in: leagueIds}});
	},
	byLeagueIdAndIdsWithLimit: function (leagueId, ids, limit) {
		return Match.find({_id: {$in: ids}, league: leagueId}).sort({'kickofftime': -1}).limit(limit); // sorted desc
	},
	getIdArr: function (matches) {
		return matches.map(function (match) {
			return match._id.toString();
		});
	},
	byIdAndStartBeforeDate: function (id, date) {
		return Match.findOne({kickofftime: {$gte: date}, _id: id}).sort({'kickofftime': 1});
	},
	getNextMatch: function () {
		return Match.findOne({kickofftime: {$gte: new Date()}}).sort({'kickofftime': 1});
	},
};