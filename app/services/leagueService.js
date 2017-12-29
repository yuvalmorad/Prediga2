const League = require('../models/league');
const utils = require('../utils/util');
const Match = require('../models/match');

const self = module.exports = {
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
                const competitionIds = arr[0].map(function (league) {
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
            const leagueIds = arr2[0].map(function (league) {
                return league._id;
            });

            return Match.find({league: {$in: leagueIds}});
        });
    }
};