let League = require('../models/league');
let utils = require('../utils/util');
let Match = require('../models/match');

let self = module.exports = {
    updateLeague: function (league) {
        console.log('beginning to update league');
        return League.findOneAndUpdate({_id: league._id}, league, utils.overrideSettings, function (err, obj) {
                if (err) {
                    return Promise.reject('general error');
                }
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
                let competitionIds = arr[0].map(function (league) {
                    return league.competition365;
                });
                return competitionIds;
            }
        });
    },
    getUsersMatchesByLeagues: function () {
        return Promise.all([
            // TODO - find user's groups + group's leagues
            League.find({})
        ]).then(function (arr2) {
            let leagueIds = arr2[0].map(function (league) {
                return league._id;
            });

            return Match.find({league: {$in: leagueIds}});
        });
    }
};