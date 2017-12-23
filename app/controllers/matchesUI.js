let express = require('express');
let app = express.Router();
let Match = require('../models/match');
let matchPredictionService = require('../services/matchPredictionsService');
let util = require('../utils/util.js');
let MatchResult = require('../models/matchResult');

app.get('/', util.isLoggedIn, function (req, res) {
    let user = req.user;
    getData(user._id).then(function (matchesCombined) {
        res.status(200).json(matchesCombined);
    });
});

function getData(me) {
    return Promise.all([
        Match.find({}),
        matchPredictionService.getPredictionsByUserId(me, true, me),
        MatchResult.find({}),
        matchPredictionService.getFutureGamesPredictionsCounters(),
    ]).then(function (arr) {
        return {
            matches: arr[0],
            predictions: arr[1],
            results: arr[2],
            predictionsCounters: arr[3]
        }
    });
}

module.exports = app;