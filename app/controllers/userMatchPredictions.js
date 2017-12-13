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
    return MatchPrediction.find({userId: userId}).then(function(predictions){
        var predictionsMatchIds = predictions.map(function(prediction){
            return prediction.matchId;
        });

        return MatchResult.find({matchId: {$in: predictionsMatchIds}}).then(function(matchResults){
            var relevantMatchIds = matchResults.map(function(prediction){
                return prediction.matchId;
            });
            var predictionsFiltered = predictions.filter(function(prediction){
                return relevantMatchIds.indexOf(prediction.matchId) >=0;
            });

            return Match.find({_id: {$in: relevantMatchIds}}).then(function(matches){
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