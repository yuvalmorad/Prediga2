var express = require('express');
var app = express.Router();
var Match = require('../models/match');
var MatchPrediction = require('../models/matchPrediction');
var util = require('../utils/util.js');
var MatchResult = require('../models/matchResult');

app.get('/:userId', util.isLoggedIn, function (req, res) {
    var userId = req.params.userId;
    getData(userId).then(function (obj) {
        res.status(200).json(obj);
    });
});

function getData(userId) {
    return Promise.all([
        Match.find({}),
        MatchPrediction.find({userId: userId}),
        MatchResult.find({})
    ]).then(function (arr) {
        return {
            matches: arr[0],
            predictions: arr[1],
            results: arr[2]
        }
    });
}

module.exports = app;