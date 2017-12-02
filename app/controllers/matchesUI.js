var express = require('express');
var app = express.Router();
var Match = require('../models/match');
var MatchPrediction = require('../models/matchPrediction');
var util = require('../utils/util.js');
var User = require('../models/user');
var Q = require('q');

app.get('/', util.isLoggedIn, function (req, res) {
    var userId = req.user._id;
    getData(userId).then(function (matches) {
        res.status(200).json(matches);
    });
});

function getData(userId) {
    var deferred = Q.defer();
    var itemsProcessed = 0;

    Match.find({}, function (err, matches) {
        var result = [];
        matches.forEach(function (aMatch) {
            getMatchDetails(aMatch, userId).then(function (aMatchDetailsResult) {
                itemsProcessed++;
                result.push(aMatchDetailsResult);
                if (itemsProcessed === matches.length) {
                    deferred.resolve(result);
                }
            });
        });
    });
    return deferred.promise;
}

function getMatchDetails(aMatch, userId) {
    var deferred = Q.defer();
    var matchCopy = aMatch.toJSON();

    // set initial jsons
    matchCopy.userPrediction = {};
    matchCopy.othersPredictions = {
        "team1": [], "team2": [], "draw": []
    };
    MatchPrediction.find({matchId: matchCopy._id}, function (err, allPredictions) {
        if (allPredictions && allPredictions.length > 0) {
            var itemsProcessed = 0;
            allPredictions.forEach(function (aPrediction) {
                setPredictionInMatch(aPrediction, userId, matchCopy).then(function (matchCopy) {
                    itemsProcessed++;
                    if (itemsProcessed === allPredictions.length) {
                        deferred.resolve(matchCopy);
                    }
                });
            });
        } else {
            deferred.resolve(matchCopy);
        }
    });
    return deferred.promise;
}

function setPredictionInMatch(aPrediction, userId, aMatch) {
    var deferred = Q.defer();
    if (aPrediction.userId === userId.toString()) {
        aMatch.userPrediction = aPrediction;
        deferred.resolve(aMatch);
    } else {
        User.findOne({_id: aPrediction.userId}, function (err, otherUser) {
            if (aPrediction.winner === aMatch.team1) {
                aMatch.othersPredictions.team1.push(otherUser);
            } else if (aPrediction.winner === aMatch.team2) {
                aMatch.othersPredictions.team1.push(otherUser);
            } else {
                aMatch.othersPredictions.team1.push(otherUser);
            }
            deferred.resolve(aMatch);
        });
    }
    return deferred.promise;
}

module.exports = app;