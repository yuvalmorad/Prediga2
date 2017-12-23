let League = require('../models/league');

let self = module.exports = {
    updateLeague: function (league) {
        console.log('beginning to update league');
        return League.findOneAndUpdate({_id: league._id}, league, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, obj) {
                if (err) {
                    return Promise.reject('general error');
                }
            }
        );
    },
    getSyncActive: function () {
        return League.find({syncResults365: true}, function (err, leagues) {
            if (!leagues) {
                return [];
            } else {
                let competitionIds = leagues.map(function (league) {
                    return league.competition365;
                });
                return competitionIds;
            }
        });
    }
};