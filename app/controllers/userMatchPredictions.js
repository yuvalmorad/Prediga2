let express = require('express');
let app = express.Router();
let Match = require('../models/match');
let matchPredictionsService = require('../services/matchPredictionsService');
let util = require('../utils/util.js');
let MatchResult = require('../models/matchResult');

app.get('/:userId', util.isLoggedIn, function (req, res) {
    let userId = req.params.userId;
    getData(userId).then(function (obj) {
        res.status(200).json(obj);
    });
});

function getData(userId) {
    return Promise.all([
        matchPredictionsService.getPredictionsByUserId(userId, false)

    ]).then(function (arr) {
        let predictionsMatchIds = arr[0].map(function (prediction) {
            return prediction.matchId;
        });

        return Promise.all([
            MatchResult.find({matchId: {$in: predictionsMatchIds}})
        ]).then(function (arr2) {
            let relevantMatchIds = arr2[0].map(function (prediction) {
                return prediction.matchId;
            });
            let predictionsFiltered = arr[0].filter(function (prediction) {
                return relevantMatchIds.indexOf(prediction.matchId) >= 0;
            });
            return Promise.all([
                Match.find({_id: {$in: relevantMatchIds}}).sort({'kickofftime': -1}).limit(6)
            ]).then(function (arr3) {
                return {
                    predictions: predictionsFiltered,
                    results: arr2[0],
                    matches: arr3[0]
                };
            });
        });
    });
}

module.exports = app;