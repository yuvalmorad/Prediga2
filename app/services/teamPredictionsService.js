let Q = require('q');
let Team = require('../models/team');
let TeamPrediction = require('../models/teamPrediction');
let utils = require('../utils/util');
let self = module.exports = {
    createTeamPredictions(teamPredictions, userId) {
        let now = new Date();
        let promises = teamPredictions.map(function (teamPrediction) {
            // we can update only if the kickofftime is not passed
            return Team.findOne({deadline: {$gte: now}, _id: teamPrediction.teamId}).then(function (aTeam) {
                if (aTeam) {
                    teamPrediction.userId = userId;
                    return TeamPrediction.findOneAndUpdate({
                        teamId: teamPrediction.teamId,
                        userId: userId
                    }, teamPrediction, utils.updateSettings);
                } else {
                    return Promise.reject('general error');
                }
            });
        });

        return Promise.all(promises);
    },
    getPredictionsForOtherUsersInner: function (teams, userId) {
        let promises = teams.map(function (aTeam) {
            if (userId) {
                return TeamPrediction.find({teamId: aTeam._id, userId: userId});
            } else {
                return TeamPrediction.find({teamId: aTeam._id});
            }
        });
        return Promise.all(promises);
    },
    getPredictionsForOtherUsers: function (userId, me, teamIds) {
        let now = new Date();
        return Promise.all([
            typeof(teamIds) === 'undefined' ?
                Team.find({deadline: {$lt: now}}) :
                Team.find({deadline: {$lt: now}, teamId: {$in: teamIds}})
        ]).then(function (arr) {
            return Promise.all([
                self.getPredictionsForOtherUsersInner(arr[0], userId, me),
                typeof(teamIds) === 'undefined' ?
                    TeamPrediction.find({userId: me}) :
                    TeamPrediction.find({teamId: {$in: teamIds}, userId: me})
            ]).then(function (arr2) {
                let mergedPredictions = [];

                // Merging between other & My predictions
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
    getPredictionsByUserId: function (userId, isForMe, me, teamIds) {
        let deferred = Q.defer();

        if (isForMe) {
            if (typeof(teamIds) !== 'undefined') {
                TeamPrediction.find({userId: userId, teamId: {$in: teamIds}}, function (err, aTeamPredictions) {
                    deferred.resolve(aTeamPredictions);
                });
            } else {
                TeamPrediction.find({userId: userId}, function (err, aTeamPredictions) {
                    deferred.resolve(aTeamPredictions);
                });
            }

        } else {
            self.getPredictionsForOtherUsers(userId, me, teamIds).then(function (aTeamPredictions) {
                deferred.resolve(aTeamPredictions);
            });
        }

        return deferred.promise;
    },
    getPredictionsByTeamId: function (teamIds, isForMe, me) {
        let deferred = Q.defer();

        if (isForMe) {
            TeamPrediction.find({teamId: {$in: teamIds}}, function (err, aTeamPredictions) {
                deferred.resolve(aTeamPredictions);
            });
        } else {
            self.getPredictionsForOtherUsers(undefined, me, teamIds).then(function (aTeamPredictions) {
                deferred.resolve(aTeamPredictions);
            });
        }

        return deferred.promise;
    }
};