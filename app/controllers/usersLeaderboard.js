var express = require('express');
var app = express.Router();
var UsersLeaderboard = require('../models/usersLeaderboard');
var util = require('../utils/util.js');
var User = require('../models/user');

app.get('/', util.isLoggedIn, function (req, res) {
    UsersLeaderboard.find({}, function (err, leaderboardRes) {
        if (err || !leaderboardRes) {
            res.status(403).json(util.errorResponse.format('error'));
        } else {
            User.find({}, function (err, allUsers) {
                var result = {
                    users: allUsers,
                    leaderboard: leaderboardRes
                };
                res.status(200).json(result);
            });
        }
    });
});

module.exports = app;