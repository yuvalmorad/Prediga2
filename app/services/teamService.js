let Q = require('q');
let Team = require('../models/team');
let TeamResult = require('../models/teamResult');
let UserScore = require('../models/userScore');
let util = require('../utils/util');

let self = module.exports = {
    updateTeams: function (teams) {
        console.log('beginning to update ' + teams.length + ' teams');
        let promises = teams.map(function (team) {
            return Team.findOneAndUpdate({_id: team._id}, team, util.updateSettings, function (err, obj) {
                    if (err) {
                        return Promise.reject('general error');
                    }
                }
            );
        });

        return Promise.all(promises);
    },
    removeTeams: function (league) {
        let deferred = Q.defer();
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
        let promises = leagueTeams.map(function (aTeam) {
            aTeam.remove();
            return TeamResult.remove({teamId: aTeam._id}, function (err, obj) {
                return UserScore.remove({gameId: aTeam._id});
            });
        });
        return Promise.all(promises);
    }
};