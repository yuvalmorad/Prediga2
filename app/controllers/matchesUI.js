let express = require('express');
let app = express.Router();
let Match = require('../models/match');
let MatchPrediction = require('../models/matchPrediction');
let util = require('../utils/util.js');
let MatchResult = require('../models/matchResult');

app.get('/', util.isLoggedIn, function (req, res) {
    getData().then(function (matchesCombined) {
        res.status(200).json(matchesCombined);
    });
});

function getData() {
    return Promise.all([
        Match.find({}),
        MatchPrediction.find({}),
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