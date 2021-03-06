const utils = require('../utils/util');
const League = require('../models/league');

const self = module.exports = {
	updateLeague: function (league) {
		//console.log('beginning to update league: ' + league.name);
		return League.findOneAndUpdate({_id: league._id}, league, utils.updateSettings).then(function (newLeague) {
				return Promise.resolve(newLeague);
			}
		);
	},
	getCompetitionIdForActiveLeagues: function () {
		return League.find({syncResults365: true}).then(function (leagues) {
			if (!leagues) {
				return Promise.resolve([]);
			} else {
				const competitionIds = self.getCompetitionIds(leagues);
				// special fix for 2020-2021 champions
                for (var i=64; i<= 71; i++){
                    competitionIds.push(i);
                }

				return Promise.resolve(competitionIds);
			}
		});
	},
	getActiveLeagues: function () {
		return League.find({syncResults365: true});
	},
	byClubIdAndLeagueIds: function (clubId, leagueIds) {
		return League.find({_id: {$in: leagueIds, clubs: clubId}});
	},
	byIds: function (leagueIds) {
		return League.find({_id: {$in: leagueIds}});
	},
	byId: function (leagueId) {
		return League.findOne({_id: leagueId});
	},
	all: function () {
		return League.find({});
	},
	getIdArr: function (leagues) {
		return leagues.map(function (league) {
			return league._id.toString();
		});
	},
	getCompetitionIds: function (leagues) {
		return leagues.map(function (league) {
			return league.competition365;
		});
	}
};