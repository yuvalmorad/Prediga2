let Q = require('q');
let Match = require('../models/match');
let MatchResult = require('../models/matchResult');
let UserScore = require('../models/userScore');
let util = require('../utils/util');

let self = module.exports = {
    updateMatches: function (matches) {
        console.log('beginning to update ' + matches.length + ' matches');
        let promises = matches.map(function (match) {
            return Match.findOneAndUpdate({_id: match._id}, match, util.updateSettings, function (err, obj) {
                    if (err) {
                        return Promise.reject('general error');
                    }
                }
            );
        });
        return Promise.all(promises);
    },

    /**
     * Remove all (matches, match results, user scores).
     */
    removeMatches: function (league) {
        let deferred = Q.defer();
        Match.find({league: league}, function (err, leagueMatches) {
            if (err) return console.log(err);
            if (!leagueMatches || !Array.isArray(leagueMatches) || leagueMatches.length === 0) {
                deferred.resolve();
                return;
            }

            //console.log('removing ' + leagueMatches.length + ' matches for ' + league);
            self.removeLeagueMatches(leagueMatches).then(function () {
                deferred.resolve();
            });
        });
        return deferred.promise;
    },
    removeLeagueMatches: function (leagueMatches) {
        let promises = leagueMatches.map(function (aMatch) {
            aMatch.remove();
            return MatchResult.remove({matchId: aMatch._id}, function (err, obj) {
                return UserScore.remove({gameId: aMatch._id});
            });
        });
        return Promise.all(promises);
    },
    findMatchByTeamsToday: function (team1, team2) {
        let deferred = Q.defer();
        let today = new Date();
        let after = new Date();
        let before = new Date();
        after.setMinutes(today.getMinutes() + 200);
        before.setDate(today.getDate() - 200);

        Match.find({
            kickofftime: {$gte: before, $lte: after},
            team1: team1,
            team2: team2
        }, function (err, relevantMatches) {
            if (err) return console.log(err);
            if (!relevantMatches || !Array.isArray(relevantMatches) || relevantMatches.length === 0) {
                deferred.resolve();
                return;
            }
            deferred.resolve(relevantMatches[0]);
        });
        return deferred.promise;
    },
    getNextMatchDate: function () {
        let now = new Date();

        return Promise.all([
            Match.findOne({kickofftime: {$gte: now}}).sort({'kickofftime': 1}).limit(1)
        ]).then(function (arr) {
            return arr[0]
        });
    },
    findMatchesThatAreClosedAndNotFinished: function () {
        let deferred = Q.defer();
        let now = new Date();
        let after = new Date();
        after.setMinutes(after.getMinutes() - 105);

        Match.find({
            kickofftime: {$gte: after, $lte: now}
        }, function (err, relevantMatches) {
            deferred.resolve(relevantMatches);
        });
        return deferred.promise;
    }
};