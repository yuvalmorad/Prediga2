var Q = require('q');
var Team = require('../models/team');

module.exports = {
    createTeams: function (teams, league) {
        var deferred = Q.defer();
        var itemsProcessed = 0;
        console.log('creating '+ teams.length +' teams for ' + league);
        teams.forEach(function (team) {
            Team.findOneAndUpdate({_id: team._id}, team, {
                    upsert: true,
                    setDefaultsOnInsert: true
                }, function (err, obj) {
                    if (err) {
                        deferred.resolve(err.message);
                    } else {
                        itemsProcessed++;
                        if (itemsProcessed === teams.length) {
                            deferred.resolve(teams);
                        }
                    }
                }
            );
        });
        return deferred.promise;
    }
};