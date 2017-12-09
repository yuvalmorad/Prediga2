var express = require('express');
var app = express.Router();
var UserScore = require('../models/userScore');
var util = require('../utils/util.js');
//var UsersLeaderboardService = require('../services/leaderboardService');

app.get('/', util.isAdmin, function (req, res) {
    UserScore.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

/*
user score is updated via initial data.
app.delete('/:gameId', util.isAdmin, function (req, res) {
    var gameId = req.params.gameId;
    if (!gameId) {
        res.status(500).json(util.errorResponse.format('provide gameId'));
        return;
    }
    UserScore.remove({gameId: gameId}, function (err) {
        if (err) {
            res.status(500).json(util.errorResponse.format('cant remove'));
        }
        UsersLeaderboardService.updateLeaderboard().then(function (obj) {
            res.status(200).json(util.okResponse);
        });
    });
});
*/

module.exports = app;