let Q = require('q');
let Match = require('../models/match');
let MatchPrediction = require('../models/matchPrediction');

let self = module.exports = {
    /**
     * NOT SECURE API, USED BY /SIMULATOR AND MATCHES ARE FILTERED BEFORE CALLING TO THIS METHOD
     * @param matches
     * @returns {*|PromiseLike<any>|Promise}
     */
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
    },
    getPredictionsForOtherUsersInner: function (matches, userId, me) {
        let promises = matches.map(function (aMatch) {
            if (userId) {
                return MatchPrediction.find({matchId: aMatch._id, userId: userId});
            } else {
                return MatchPrediction.find({matchId: aMatch._id, userId: {$ne: me}});
            }
        });
        return Promise.all(promises);
    },
    getPredictionsForOtherUsers: function (userId, matchId, me) {
        let now = new Date();
        return Promise.all([
            typeof(matchId) === 'undefined' ?
                Match.find({kickofftime: {$lt: now}}) :
                Match.find({kickofftime: {$lt: now}, matchId: matchId})
        ]).then(function (arr) {
            return Promise.all([
                self.getPredictionsForOtherUsersInner(arr[0], userId, me),
                typeof(matchId) === 'undefined' ?
                    MatchPrediction.find({userId: me}) :
                    MatchPrediction.find({matchId: matchId, userId: me})
            ]).then(function (arr2) {
                let mergedPredictions = [];
                // merging between others & My predictions
                if (arr2[0]) {
                    mergedPredictions = mergedPredictions.concat.apply([], arr2[0]);
                }
                if (arr2[1]) {
                    mergedPredictions = mergedPredictions.concat(arr2[1]);
                }
                return mergedPredictions;
            });
        });
    },
    getPredictionsByUserId: function (userId, isForMe, me) {
        let deferred = Q.defer();

        if (isForMe) {
            MatchPrediction.find({userId: userId}, function (err, aMatchPredictions) {
                deferred.resolve(aMatchPredictions);
            });
        } else {
            self.getPredictionsForOtherUsers(userId, undefined, me).then(function (aMatchPredictions) {
                deferred.resolve(aMatchPredictions);
            });
        }

        return deferred.promise;
    },
    getPredictionsByMatchId: function (matchId, isForMe, me) {
        let deferred = Q.defer();

        if (isForMe) {
            MatchPrediction.find({matchId: matchId}, function (err, aMatchPredictions) {
                deferred.resolve(aMatchPredictions);
            });
        } else {
            self.getPredictionsForOtherUsers(undefined, matchId, me).then(function (aMatchPredictions) {
                deferred.resolve(aMatchPredictions);
            });
        }

        return deferred.promise;
    }
};