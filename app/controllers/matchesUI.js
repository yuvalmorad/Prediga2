var express = require('express');
var app = express.Router();
var Match = require('../models/match');
var MatchPrediction = require('../models/matchPrediction');
var util = require('../utils/util.js');
var User = require('../models/user');
var Q = require('q');

app.get('/', util.isLoggedIn, function (req, res) {
    getData().then(function (matchesCombined) {
        res.status(200).json(matchesCombined);
    });
});

function getData() {
    var deferred = Q.defer();
    var result = {};

    Match.find({}, function (err, allMatches) {
        result["matches"] = allMatches;

        MatchPrediction.find({}, function (err, allPredictions) {
            result["predictions"] = allPredictions;

            User.find({}, function (err, allUsers) {
                result["users"] = allUsers;
                deferred.resolve(result);
            });
        });

    });
    return deferred.promise;
}

module.exports = app;