let Q = require('q');
let Team = require('../models/team');
let TeamPrediction = require('../models/teamPrediction');

let self = module.exports = {
    creaTeamPredictions(teamPredictions, userId) {
        let now = new Date();
        let promises = teamPredictions.map(function (teamPrediction) {
            // we can update only if the kickofftime is not passed
            return Team.findOne({deadline: {$gte: now}, _id: teamPrediction.teamId}).then(function (aTeam) {
                if (aTeam) {
                    teamPrediction.userId = userId;
                    return TeamPrediction.findOneAndUpdate({
                        teamId: teamPrediction.teamId,
                        userId: userId
                    }, teamPrediction, {
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
    getPredictionsForOtherUsers: function (userId, teamId, me) {
        let now = new Date();
        return Promise.all([
            typeof(teamId) === 'undefined' ?
                Team.find({deadline: {$lt: now}}) :
                Team.find({deadline: {$lt: now}, teamId: teamId})
        ]).then(function (arr) {
            return Promise.all([
                self.getPredictionsForOtherUsersInner(arr[0], userId, me),
                typeof(teamId) === 'undefined' ?
                    TeamPrediction.find({userId: me}) :
                    TeamPrediction.find({teamId: teamId, userId: me})
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
    getPredictionsByUserId: function (userId, isForMe, me) {
        let deferred = Q.defer();

        if (isForMe) {
            TeamPrediction.find({userId: userId}, function (err, aTeamPredictions) {
                deferred.resolve(aTeamPredictions);
            });
        } else {
            self.getPredictionsForOtherUsers(userId, undefined, me).then(function (aTeamPredictions) {
                deferred.resolve(aTeamPredictions);
            });
        }

        return deferred.promise;
    },
    getPredictionsByTeamId: function (teamId, isForMe, me) {
        let deferred = Q.defer();

        if (isForMe) {
            TeamPrediction.find({teamId: teamId}, function (err, aTeamPredictions) {
                deferred.resolve(aTeamPredictions);
            });
        } else {
            self.getPredictionsForOtherUsers(undefined, teamId, me).then(function (aTeamPredictions) {
                deferred.resolve(aTeamPredictions);
            });
        }

        return deferred.promise;
    }
};