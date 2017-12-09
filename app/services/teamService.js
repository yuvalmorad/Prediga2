var Q = require('q');
var Team = require('../models/team');
var TeamResult = require('../models/teamResult');
var UserScore = require('../models/userScore');

var self = module.exports = {
    updateTeams: function (teams) {
        console.log('trying to update ' + teams.length + ' teams');
        var promises = teams.map(function (team) {
            return Team.findOneAndUpdate({_id: team._id}, team, {
                    upsert: true,
                    setDefaultsOnInsert: true
                }, function (err, obj) {
                    if (err) {
                        return Promise.reject('general error');
                    }
                }
            );
        });

        return Promise.all(promises);
    },
    removeTeams: function (league) {
        var deferred = Q.defer();
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
        var promises = leagueTeams.map(function (aTeam) {
            aTeam.remove();
            return TeamResult.remove({teamId: aTeam._id}, function (err, obj) {
                return UserScore.remove({gameId: aTeam._id});
            });
        });
        return Promise.all(promises);
    }
};