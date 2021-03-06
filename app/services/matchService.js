const Match = require('../models/match');
const util = require('../utils/util');

const self = module.exports = {
	updateMatchesById: function (matches) {
		//console.log('beginning to update ' + matches.length + ' matches');
		const promises = matches.map(function (match) {
			return Match.findOneAndUpdate({_id: match._id}, match, util.updateSettings).then(function (newMatch) {
					return Promise.resolve(newMatch);
				}
			).catch(function (err) {
                console.log(err);
            });
		});
		return Promise.all(promises);
	},
	removeMultipleMatchesOnSameType: function (match) {
		return Match.find({
			type: match.type,
			team1: match.team1,
			team2: match.team2
		}).sort({'kickofftime': 1}).then(function (matches) {
			return self.removeMatches(matches);
		})
	},
	removeMultipleMatchesOnDates: function (match) {
		const time1 = new Date().setHours(new Date().getHours() + 24 * 2);
		const time2 = new Date().setHours(new Date().getHours() - 24 * 2);
		return Match.find({
			kickofftime: {$gte: time2, $lte: time1},
			team1: match.team1,
			team2: match.team2
		}).sort({'kickofftime': 1}).then(function (matches) {
			return self.removeMatches(matches);
		})
	},
	removeMatches: function (matches) {
		if (matches && matches.length > 1) {
			const promises = matches.map(function (match, idx) {
				if (idx === 0) {
					return Promise.resolve();
				}
				return Match.remove({_id: match._id});
			});
			return Promise.all(promises);
		} else {
			return Promise.resolve();
		}
	},
	updateMatchesByTeamsAndType: function (matches) {
		const promises = matches.map(function (match) {
			self.removeMultipleMatchesOnSameType(match).then(function () {
				self.removeMultipleMatchesOnDates(match).then(function () {
					return Match.findOneAndUpdate({
						type: match.type,
						team1: match.team1,
						team2: match.team2
					}, match, util.updateSettings).then(function (newMatch) {
							return Promise.resolve(newMatch);
						}
					);
				});
			});
		});
		return Promise.all(promises);
	},
	findFirstMatchByTeamsStarted: function (team1, team2) {
		const startTime = new Date().setHours(new Date().getHours() - 10);
		return Match.findOne({
			kickofftime: {$gte: startTime},
			team1: team1.toString(),
			team2: team2.toString()
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
	byLeagueIdAndIds: function (leagueId, ids) {
		return Match.find({_id: {$in: ids}, league: leagueId}); // sorted desc
	},
	getIdArr: function (matches) {
		return matches.map(function (match) {
			return match._id.toString();
		});
	},
	byIdAndStartBeforeDate: function (id, date) {
		return Match.findOne({kickofftime: {$gte: date}, _id: id}).sort({'kickofftime': 1});
	},
	getNextMatch: function (min) {
		const time = new Date().setMinutes(new Date().getMinutes() + min);
		return Match.findOne({kickofftime: {$gte: time}}).sort({'kickofftime': 1});
	},
	getMatchesOneHourBeforeStart: function () {
		const time1 = new Date().setMinutes(new Date().getMinutes() + 61);
		const time2 = new Date().setMinutes(new Date().getMinutes() + 59);
		return Match.find({kickofftime: {$gte: time2, $lte: time1}}).sort({'kickofftime': 1});
	}
};