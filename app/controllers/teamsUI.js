var express = require('express');
var app = express.Router();
var Team = require('../models/team');
var TeamPrediction = require('../models/teamPrediction');
var util = require('../utils/util.js');
var User = require('../models/user');
var Q = require('q');

app.get('/', util.isLoggedIn, function (req, res) {
    getData().then(function (teamsCombined) {
        res.status(200).json(teamsCombined);
    });
});

function getData() {
    var deferred = Q.defer();
    var result = {};

    Team.find({}, function (err, allTeams) {
        result["teams"] = allTeams;

        TeamPrediction.find({}, function (err, allPredictions) {
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