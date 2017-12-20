let express = require('express');
let app = express.Router();
let Match = require('../models/match');
let matchPredictionsService = require('../services/matchPredictionsService');
let util = require('../utils/util.js');
let MatchResult = require('../models/matchResult');

app.get('/:userId', util.isLoggedIn, function (req, res) {
    let userId = req.params.userId;
    let user = req.user;
    let isForMe = user._id.toString() === userId || typeof(userId) === 'undefined';

    getData(userId, isForMe).then(function (obj) {
        res.status(200).json(obj);
    });
});

function getData(userId, isForMe) {
    return matchPredictionsService.getPredictionsByUserId(userId, isForMe).then(function (predictions) {
        let predictionsMatchIds = predictions.map(function (prediction) {
            return prediction.matchId;
        });

        return MatchResult.find({matchId: {$in: predictionsMatchIds}}).then(function (matchResults) {
            let relevantMatchIds = matchResults.map(function (prediction) {
                return prediction.matchId;
            });
            let predictionsFiltered = predictions.filter(function (prediction) {
                return relevantMatchIds.indexOf(prediction.matchId) >= 0;
            });

            return Match.find({_id: {$in: relevantMatchIds}}).then(function (matches) {
                return {
                    predictions: predictionsFiltered,
                    matches: matches,
                    results: matchResults
                };
            });
        });
    });
}

module.exports = app;