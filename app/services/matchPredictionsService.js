let Q = require('q');
var Match = require('../models/match');
var MatchPrediction = require('../models/matchPrediction');

var self = module.exports = {
    findPredictionsByMatchIds: function (matches) {
        let deferred = Q.defer();
        if (matches && matches.length < 1) {
            deferred.resolve([]);
        }
        let matchIds = matches.map(function (match) {
            return match._id;
        });
        MatchPrediction.find({matchId: {$in: matchIds}}).then(function (predictions) {
            deferred.resolve(predictions);
        });
        return deferred.promise;
    },
    createMatchPredictions(matchPredictions, userId) {
        let now = new Date();
        let deadline = new Date();
        deadline.setMinutes(now.getMinutes() + 5);
        let promises = matchPredictions.map(function (matchPrediction) {
            // we can update only until 5 minutes before kick off time.
            return Match.findOne({kickofftime: {$gte: deadline}, _id: matchPrediction.matchId}).then(function (aMatch) {
                if (aMatch) {
                    // fixing wrong input
                    if (typeof(matchPrediction.winner) === 'undefined') {
                        matchPrediction.winner = 'draw';
                    }
                    if (typeof(matchPrediction.firstToScore) === 'undefined') {
                        matchPrediction.firstToScore = 'none';
                    }
                    // validation:
                    if (((matchPrediction.winner !== aMatch.team1) && (matchPrediction.winner !== aMatch.team2) && (matchPrediction.winner.toLowerCase() !== "draw")) ||
                        ((matchPrediction.firstToScore !== aMatch.team1) && (matchPrediction.firstToScore !== aMatch.team2) && matchPrediction.firstToScore.toLowerCase() !== "none") ||
                        matchPrediction.team1Goals < 0 || matchPrediction.team2Goals < 0 || matchPrediction.goalDiff < 0) {
                        return Promise.reject('general error');
                    }

                    matchPrediction.userId = userId;
                    return MatchPrediction.findOneAndUpdate({
                        matchId: matchPrediction.matchId,
                        userId: userId
                    }, matchPrediction, {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    });
                } else {
                    return Promise.reject('general error');
                }
            });
        });

        return Promise.all(promises);
    }
};