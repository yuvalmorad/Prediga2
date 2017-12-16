var Q = require('q');
var Match = require('../models/match');
var MatchResult = require('../models/matchResult');
var UserScore = require('../models/userScore');

var self = module.exports = {
    // TODO - update only if necessary
    updateMatches: function (matches) {
        console.log('beginning to update ' + matches.length + ' matches');
        var promises = matches.map(function (match) {
            return Match.findOneAndUpdate({_id: match._id}, match, {
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

    /**
     * Remove all (matches, match results, user scores).
     */
    removeMatches: function (league) {
        var deferred = Q.defer();
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
        var promises = leagueMatches.map(function (aMatch) {
            aMatch.remove();
            return MatchResult.remove({matchId: aMatch._id}, function (err, obj) {
                return UserScore.remove({gameId: aMatch._id});
            });
        });
        return Promise.all(promises);
    },
    findMatchByTeamsToday: function (team1, team2) {
        var deferred = Q.defer();
        var today = new Date();
        var tomorrow = today;
        var yesterday = today;
        tomorrow.setDate(today.getDate() + 1);
        yesterday.setDate(today.getDate() - 1);

        Match.find({
            kickofftime: {$gte: yesterday},
            kickofftime: {$lte: tomorrow},
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
    }
};