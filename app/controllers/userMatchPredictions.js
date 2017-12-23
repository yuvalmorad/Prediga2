let express = require('express');
let app = express.Router();
let Match = require('../models/match');
let MatchPredictions = require('../models/matchPrediction');
let util = require('../utils/util.js');
let MatchResult = require('../models/matchResult');

app.get('/:userId', util.isLoggedIn, function (req, res) {
    let userId = req.params.userId;
    getData(userId).then(function (obj) {
        res.status(200).json(obj);
    });
});

function getData(userId) {
    let now = new Date();
    return Match.find({kickofftime: {$lte: now}}).sort({'kickofftime': -1}).limit(6).exec().then(function (lastFinishedMatches) {
        if (lastFinishedMatches && lastFinishedMatches.length > 0) {
            let matchIds = lastFinishedMatches.map(function (match) {
                return match._id;
            });
            return Promise.all([
                MatchPredictions.find({matchId: {$in: matchIds}, userId: userId}),
                MatchResult.find({matchId: {$in: matchIds}})
            ]).then(function (arr) {
                return {
                    predictions: arr[0],
                    matches: lastFinishedMatches,
                    results: arr[1]
                }
            });
        } else {
            return {
                predictions: [],
                matches: [],
                results: []
                // TODO - add also teams results.
            };
        }
    });
}

module.exports = app;