let Q = require('q');
let Match = require('../models/match');
let MatchPrediction = require('../models/matchPrediction');
let utils = require('../utils/util');

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
    createMatchPredictions(matchPredictions, userId, minBefore) {
        let now = new Date();
        let deadline = new Date();
        deadline.setMinutes(now.getMinutes() + minBefore);
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
                    }, matchPrediction, utils.updateSettings);
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
    getPredictionsForOtherUsers: function (userId, me, matchIds) {
        let now = new Date();
        return Promise.all([
            typeof(matchIds) === 'undefined' ?
                Match.find({kickofftime: {$lt: now}}) :
                Match.find({kickofftime: {$lt: now}, matchId: {$in: matchIds}})
        ]).then(function (arr) {
            return Promise.all([
                self.getPredictionsForOtherUsersInner(arr[0], userId, me),
                typeof(matchIds) === 'undefined' ?
                    MatchPrediction.find({userId: me}) :
                    MatchPrediction.find({matchId: {$in: matchIds}, userId: me})
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
    getPredictionsByUserId: function (userId, isForMe, me, matchIds) {
        let deferred = Q.defer();

        if (isForMe) {
            if (typeof(matchIds) !== 'undefined') {
                MatchPrediction.find({userId: userId, matchId: {$in: matchIds}}, function (err, aMatchPredictions) {
                    deferred.resolve(aMatchPredictions);
                });
            } else {
                MatchPrediction.find({userId: userId}, function (err, aMatchPredictions) {
                    deferred.resolve(aMatchPredictions);
                });
            }

        } else {
            self.getPredictionsForOtherUsers(userId, me, matchIds).then(function (aMatchPredictions) {
                deferred.resolve(aMatchPredictions);
            });
        }

        return deferred.promise;
    },
    getPredictionsByMatchIds: function (matchIds, isForMe, me) {
        let deferred = Q.defer();

        if (isForMe) {
            MatchPrediction.find({matchId: matchIds}, function (err, aMatchPredictions) {
                deferred.resolve(aMatchPredictions);
            });
        } else {
            self.getPredictionsForOtherUsers(undefined, me, matchIds).then(function (aMatchPredictions) {
                deferred.resolve(aMatchPredictions);
            });
        }

        return deferred.promise;
    },
    getFutureGamesPredictionsCounters: function (matchIdsRelevant) {
        let now = new Date();
        return Promise.all([
            Match.find({kickofftime: {$gte: now}, matchId: {$in: matchIdsRelevant}})
        ]).then(function (arr) {
            let matchIds = arr[0].map(function (match) {
                return match._id;
            });

            return Promise.all([
                MatchPrediction.find({matchId: {$in: matchIds}})
            ]).then(function (arr2) {
                return self.aggegrateFuturePredictions(arr2[0]);
            });
        });
    },
    aggegrateFuturePredictions: function (matchPredictions) {
        let deferred = Q.defer();
        let result = {};
        let itemsProcessed = 0;
        if (matchPredictions && matchPredictions.league > 0) {
            matchPredictions.forEach(function (matchPrediction) {
                itemsProcessed += 1;
                if (!result.hasOwnProperty(matchPrediction.matchId)) {
                    result[matchPrediction.matchId] = {};
                }

                if (!result[matchPrediction.matchId].hasOwnProperty(matchPrediction.winner)) {
                    result[matchPrediction.matchId][matchPrediction.winner] = 1;
                } else {
                    result[matchPrediction.matchId][matchPrediction.winner]++;
                }

                if (itemsProcessed === matchPredictions.length) {
                    deferred.resolve(result);
                }
            });
        } else {
            deferred.resolve(result);
        }

        return deferred.promise;
    }
};