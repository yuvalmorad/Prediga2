var express = require('express');
var app = express.Router();
var Match = require('../models/match');
var MatchPrediction = require('../models/matchPrediction');
var util = require('../utils/util.js');
var User = require('../models/user');
var MatchResult = require('../models/matchResult');

app.get('/', util.isLoggedIn, function (req, res) {
    getData().then(function (matchesCombined) {
        res.status(200).json(matchesCombined);
    });
});

function getData() {
    return Promise.all([
        Match.find({}),
        MatchPrediction.find({}),
        User.find({}),
        MatchResult.find({})
    ]).then(function (arr) {
        return {
            matches: arr[0],
            predictions: arr[1],
            users: arr[2],
            results: arr[3]
        }
    });
}

module.exports = app;