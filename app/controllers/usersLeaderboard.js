let express = require('express');
let app = express.Router();
let UsersLeaderboardService = require('../services/usersLeaderboardService');
let util = require('../utils/util.js');

app.get('/', util.isLoggedIn, function (req, res) {
    UsersLeaderboardService.getLeaderboardWithNewRegisteredUsers().then(function (leaderboardCombined) {
        res.status(200).json(leaderboardCombined);
    });
});

app.post('/', util.isAdmin, function (req, res) {
    UsersLeaderboardService.updateLeaderboard().then(function () {
        res.status(200).json();
    });
});

module.exports = app;