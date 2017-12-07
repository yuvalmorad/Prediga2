var Team = require('../models/team');

module.exports = {
    createTeams: function (teams, league) {
        console.log('creating ' + teams.length + ' teams for ' + league);

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
    }
};