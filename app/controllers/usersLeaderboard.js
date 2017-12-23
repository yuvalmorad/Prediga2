let express = require('express');
let app = express.Router();
let UsersLeaderboardService = require('../services/usersLeaderboardService');
let util = require('../utils/util.js');

app.get('/:leagueId', util.isLoggedIn, function (req, res) {
    let leagueId = req.params.leagueId;
    if (!leagueId) {
        res.status(500).json(util.getErrorResponse('provide leagueId'));
        return;
    }
    UsersLeaderboardService.getLeaderboardWithNewRegisteredUsers(leagueId).then(function (leaderboards) {
        res.status(200).json(leaderboards);
    });
});

app.get('/', util.isLoggedIn, function (req, res) {
    UsersLeaderboardService.getLeaderboardWithNewRegisteredUsers().then(function (leaderboards) {
        res.status(200).json(leaderboards);
    });
});

app.post('/', util.isAdmin, function (req, res) {
    UsersLeaderboardService.updateLeaderboard().then(function () {
        res.status(200).json();
    });
});

module.exports = app;