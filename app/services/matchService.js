const Q = require('q');
const Match = require('../models/match');
const MatchResult = require('../models/matchResult');
const UserScore = require('../models/userScore');
const util = require('../utils/util');

const self = module.exports = {
	updateMatches: function (matches) {
		console.log('beginning to update ' + matches.length + ' matches');
		const promises = matches.map(function (match) {
			return Match.findOneAndUpdate({_id: match._id}, match, util.overrideSettings, function (err, obj) {
					if (err) {
						return Promise.reject('general error');
					}
				}
			);
		});
		return Promise.all(promises);
	},

	/**
	 * Remove all (matches, match results, user scores).
	 */
	removeMatches: function (league) {
		const deferred = Q.defer();
		Match.find({league: league}, function (err, leagueMatches) {
			if (err) return console.log(err);
			if (!leagueMatches || !Array.isArray(leagueMatches) || leagueMatches.length === 0) {
				deferred.resolve();
				return;
			}

			//console.log('removing ' + leagueMatches.length + ' matches for ' + league);
			self.removeLeagueMatches(leagueMatches).then(function () {
				deferred.resolve();
			});
		});
		return deferred.promise;
	},
	removeLeagueMatches: function (leagueMatches) {
		const promises = leagueMatches.map(function (aMatch) {
			aMatch.remove();
			return MatchResult.remove({matchId: aMatch._id}, function (err, obj) {
				return UserScore.remove({gameId: aMatch._id});
			});
		});
		return Promise.all(promises);
	},
	findMatchByTeamsToday: function (team1, team2) {
		const deferred = Q.defer();
		const today = new Date();
		const after = new Date();
		const before = new Date();
		after.setMinutes(today.getMinutes() + 200);
		before.setDate(today.getDate() - 200);

		Match.find({
			kickofftime: {$gte: before, $lte: after},
			team1: team1,
			team2: team2
		}, function (err, relevantMatches) {
			if (err) return console.log(err);
			if (!relevantMatches || !Array.isArray(relevantMatches) || relevantMatches.length === 0) {
				Match.find({
					kickofftime: {$gte: before, $lte: after},
					team1: team2,
					team2: team1
				}, function (err, relevantMatches2) {
					if (!relevantMatches2 || !Array.isArray(relevantMatches2) || relevantMatches2.length === 0) {
						deferred.resolve(null);
					} else {
						deferred.resolve(relevantMatches2[0]);
					}
				});
			} else {
				deferred.resolve(relevantMatches[0]);
			}

		});
		return deferred.promise;
	},
	getNextMatchDate: function () {
		const now = new Date();
		const before = new Date();
		before.setMinutes(now.getMinutes() - 105);
		return Promise.all([
			Match.findOne({kickofftime: {$gte: before}}).sort({'kickofftime': 1}).limit(1)
		]).then(function (arr) {
			return arr[0]
		});
	},
	findMatchesThatAreClosedAndNotFinished: function (matchIds) {
		const deferred = Q.defer();
		const now = new Date();
		const after = new Date();
		after.setMinutes(after.getMinutes() - 105);

		Match.find({
			kickofftime: {$gte: after, $lte: now}, _id: {$in: matchIds}
		}, function (err, relevantMatches) {
			deferred.resolve(relevantMatches);
		});
		return deferred.promise;
	}
};