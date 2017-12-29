const Q = require('q');
const Team = require('../models/team');
const TeamResult = require('../models/teamResult');
const UserScore = require('../models/userScore');
const util = require('../utils/util');

const self = module.exports = {
	updateTeams: function (teams) {
		console.log('beginning to update ' + teams.length + ' teams');
		const promises = teams.map(function (team) {
			return Team.findOneAndUpdate({_id: team._id}, team, util.overrideSettings, function (err, obj) {
					if (err) {
						return Promise.reject('general error');
					}
				}
			);
		});

		return Promise.all(promises);
	},
	removeTeams: function (league) {
		const deferred = Q.defer();
		Team.find({league: league}, function (err, leagueTeams) {
			if (err) return console.log(err);
			if (!leagueTeams || !Array.isArray(leagueTeams) || leagueTeams.length === 0) {
				deferred.resolve();
				return;
			}

			//console.log('removing ' + leagueTeams.length + ' teams for ' + league);
			self.removeLeagueTeams(leagueTeams).then(function () {
				deferred.resolve();
			});
		});
		return deferred.promise;
	},
	removeLeagueTeams: function (leagueTeams) {
		const promises = leagueTeams.map(function (aTeam) {
			aTeam.remove();
			return TeamResult.remove({teamId: aTeam._id}, function (err, obj) {
				return UserScore.remove({gameId: aTeam._id});
			});
		});
		return Promise.all(promises);
	}
};