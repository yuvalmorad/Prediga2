var Q = require('q');
var UserScore = require('../models/userScore');
var Match = require('../models/match');

module.exports = {
    updateScore: function (userScore) {
        var deferred = Q.defer();
        UserScore.findOneAndUpdate({userId: userScore.userId, gameId: userScore.gameId}, userScore, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, obj) {
                if (err) {
                    deferred.resolve('error');
                } else {
                    deferred.resolve(obj);
                }
            }
        );
        return deferred.promise;
    },
    removeUserScoreWithoutGames: function () {
        var deferred = Q.defer();
        UserScore.find({}, function (err, allUserScores) {
            if (allUserScores && allUserScores.length > 0){
                allUserScores.forEach(function (aUserScore) {
                    Match.find({_id: aUserScore.gameId}, function (err, aMatches) {
                        if (!aMatches || aMatches.length < 1) {
                            // removing all user score of this game
                            console.log('removing user scores for game ' + aUserScore.gameId);
                            UserScore.remove({gameId: aUserScore.gameId}, function (err, obj) {
                                deferred.resolve(obj);
                            });
                        }
                    });
                });
            } else {
                deferred.resolve();
            }

        });
        return deferred.promise;
    }
};