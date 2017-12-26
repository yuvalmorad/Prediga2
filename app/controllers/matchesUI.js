let express = require('express');
let app = express.Router();
let Match = require('../models/match');
let matchPredictionService = require('../services/matchPredictionsService');
let util = require('../utils/util.js');
let MatchResult = require('../models/matchResult');
let League = require('../models/league');

app.get('/', util.isLoggedIn, function (req, res) {
    let user = req.user;
    getData(user._id).then(function (matchesCombined) {
        res.status(200).json(matchesCombined);
    });
});

function getData(me) {
    return Promise.all([
        // TODO - find user's groups + group's leagues
        League.find({})
    ]).then(function (arr2) {
        let leagueIds = arr2[0].map(function (league) {
            return league._id;
        });

        return Promise.all([
            Match.find({league: {$in: leagueIds}})
        ]).then(function (arr1) {
            let matches = arr1[0];
            let matchIds = arr1[0].map(function (match) {
                return match._id;
            });

            return Promise.all([
                matchPredictionService.getPredictionsByUserId(me, true, me, matchIds),
                MatchResult.find({matchId: {$in: matchIds}}),
                matchPredictionService.getFutureGamesPredictionsCounters(matchIds),
            ]).then(function (arr) {
                return {
                    matches: matches,
                    predictions: arr[0],
                    results: arr[1],
                    predictionsCounters: arr[2]
                }
            });
        });
    });
}

module.exports = app;