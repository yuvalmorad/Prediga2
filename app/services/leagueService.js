const League = require('../models/league');
const utils = require('../utils/util');
const Match = require('../models/match');
const Group = require('../models/group');

const self = module.exports = {
	updateLeague: function (league) {
		console.log('beginning to update league ' + league.name);
		League.findOneAndUpdate({_id: league._id}, league, utils.overrideSettings).then(function (obj) {
				return obj;
			}
		);
	},
	getActiveLeagues: function () {
		return Promise.all([
			League.find({syncResults365: true})
		]).then(function (arr) {
			if (!arr[0]) {
				return [];
			} else {
				const competitionIds = arr[0].map(function (league) {
					return league.competition365;
				});
				return competitionIds;
			}
		});
	},
	getMatchesByGroupId: function (groupId, userId) {
		return Promise.all([
			Group.findOne({_id: groupId, users: userId})
		]).then(function (group) {
			if (group) {
				let leagueIds = group[0].leagueIds;
				return Promise.all([
					League.find({_id: {$in: leagueIds}})
				]).then(function (arr2) {
					const leagueIds = arr2[0].map(function (league) {
						return league._id;
					});

					return Match.find({league: {$in: leagueIds}});
				});
			} else {
				return [];
			}
		});
	}
};