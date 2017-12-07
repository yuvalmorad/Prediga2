var Q = require('q');
var User = require('../models/user');
var UserScore = require('../models/userScore');
var UsersLeaderboard = require('../models/usersLeaderboard');

module.exports = {
    updateLeaderboard: function () {
        var deferred = Q.defer();

        // 1. iterate all users
        User.find({}, function (err, users) {
            if (err) {
                deferred.resolve('error');
            } else {
                updateLeaderBoardForUsers(users).then(function () {
                    deferred.resolve({});
                });
            }
        });
        return deferred.promise;
    }
};

function updateLeaderBoardForUsers(users) {
    var promises = users.map(function (aUser) {
        return updateLeaderBoardForUser(aUser);
    });

    return Promise.all(promises);
}

function updateLeaderBoardForUser(aUser) {
    var deferred = Q.defer();

    UserScore.find({userId: aUser._id}, function (err, userScores) {
        var aggregrateScore = {
            userId: aUser._id,
            score: 0,
            strikes: 0
        };

        if (userScores && userScores.length > 0) {
            userScores.forEach(function (aUserScore) {
                if (aUserScore.score) {
                    aggregrateScore.score += aUserScore.score;
                }
                if (aUserScore.strikes) {
                    aggregrateScore.strikes += aUserScore.strikes;
                }
            });
        }

        UsersLeaderboard.findOneAndUpdate({userId: aUser._id}, aggregrateScore, {
                upsert: true, setDefaultsOnInsert: true
            }, function (err, obj) {
                if (err) {
                    deferred.resolve('error');
                } else {
                    deferred.resolve();
                }
            }
        );
    });
    return deferred.promise;
}