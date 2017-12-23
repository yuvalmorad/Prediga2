let League = require('../models/league');
let utils = require('../utils/util');

let self = module.exports = {
    updateLeague: function (league) {
        console.log('beginning to update league');
        return League.findOneAndUpdate({_id: league._id}, league, utils.updateSettings, function (err, obj) {
                if (err) {
                    return Promise.reject('general error');
                }
            }
        );
    },
    getSyncActive: function () {
        return Promise.all([
            League.find({syncResults365: true})
        ]).then(function (arr) {
            if (!arr[0]) {
                return [];
            } else {
                let competitionIds = arr[0].map(function (league) {
                    return league.competition365;
                });
                return competitionIds;
            }
        });
    }
};