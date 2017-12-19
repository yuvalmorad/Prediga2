let express = require('express');
let app = express.Router();
let matchService = require('../services/matchService');
let matchPredictionsService = require('../services/matchPredictionsService');
let util = require('../utils/util.js');

app.get('/', util.isLoggedIn, function (req, res) {
    getData().then(function (simulatorCombined) {
        res.status(200).json(simulatorCombined);
    });
});

function getData() {
    return Promise.all([
        matchService.findClosedToPredictButNotFinishedMatchesToday()
    ]).then(function (arr) {
        return matchPredictionsService.findPredictionsByMatchIds(arr[0]).then(function (predictions) {
            return {
                matches: arr[0],
                predictions: predictions
            }
        });
    });
}

module.exports = app;