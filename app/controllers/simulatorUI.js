let express = require('express');
let app = express.Router();
let matchService = require('../services/matchService');
let matchPredictionsService = require('../services/matchPredictionsService');
let util = require('../utils/util.js');
let UsersLeaderboardService = require('../services/usersLeaderboardService');

app.get('/', util.isLoggedIn, function (req, res) {
    getData().then(function (simulatorCombined) {
        res.status(200).json(simulatorCombined);
    });
});

function getData() {
    return Promise.all([
        UsersLeaderboardService.getLeaderboardWithNewRegisteredUsers(),
        matchService.findClosedToPredictButNotFinishedMatchesToday()
    ]).then(function (arr) {
        return matchPredictionsService.findPredictionsByMatchIds(arr[1]).then(function (predictions) {
            return {
                leaderboard: arr[0].leaderboard,
                users: arr[0].users,
                matches: arr[1],
                predictions: predictions
            }
        });
    });
}

module.exports = app;