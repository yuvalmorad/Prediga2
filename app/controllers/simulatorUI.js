let express = require('express');
let app = express.Router();
let matchService = require('../services/matchService');
let matchPredictionsService = require('../services/matchPredictionsService');
let util = require('../utils/util.js');
let leagueService = require('../services/leagueService');

app.get('/', util.isLoggedIn, function (req, res) {
    getData().then(function (simulatorCombined) {
        res.status(200).json(simulatorCombined);
    });
});

function getData() {
    return Promise.all([
        leagueService.getUsersMatchesByLeagues()
    ]).then(function (arr2) {
        let matchIds = arr2[0].map(function (match) {
            return match._id;
        });

        return Promise.all([
            matchService.findMatchesThatAreClosedAndNotFinished(matchIds)
        ]).then(function (arr) {
            return matchPredictionsService.findPredictionsByMatchIds(arr[0]).then(function (predictions) {
                return {
                    matches: arr[0],
                    predictions: predictions
                }
            });
        });
    });


}

module.exports = app;