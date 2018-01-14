const Q = require('q');
const Match = require('../models/match');
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
	findMatchByTeamsToday: function (team1, team2) {
		const deferred = Q.defer();
		const today = new Date();
		const after = new Date();
		const before = new Date();
		after.setHours(today.getHours() + 12);
		before.setHours(today.getHours() - 12);

		Match.find({
			kickofftime: {$gte: before, $lte: after},
			team1: team1,
			team2: team2
		}, function (err, relevantMatches) {
			if (err) return console.log(err);
			if (!relevantMatches || !Array.isArray(relevantMatches) || relevantMatches.length === 0) {
				deferred.resolve(null);
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
		after.setMinutes(after.getMinutes() - 150);

		Match.find({
			kickofftime: {$gte: after, $lte: now}, _id: {$in: matchIds}
		}, function (err, relevantMatches) {
			deferred.resolve(relevantMatches);
		});
		return deferred.promise;
	}
};