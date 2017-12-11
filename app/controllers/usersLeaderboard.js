var express = require('express');
var app = express.Router();
var UsersLeaderboard = require('../models/usersLeaderboard');
var UsersLeaderboardService = require('../services/usersLeaderboardService');
var util = require('../utils/util.js');
var User = require('../models/user');

app.get('/', util.isLoggedIn, function (req, res) {
    getData().then(function (leaderboardCombined) {
        res.status(200).json(leaderboardCombined);
    });
});

app.post('/', util.isAdmin, function (req, res) {
    UsersLeaderboardService.updateLeaderboard().then(function () {
        res.status(200).json();
    });
});

function getData() {
    return Promise.all([
        UsersLeaderboard.find({}).sort({'score': -1}),
        User.find({})
    ]).then(function (arr) {
        return {
            leaderboard: arr[0],
            users: arr[1]
        }
    });
}

module.exports = app;