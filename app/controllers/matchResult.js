var express = require('express');
var app = express.Router();
var MatchResult = require('../models/matchResult');
var MatchResultService = require('../services/matchResultService');
var UsersLeaderboardService = require('../services/leaderboardService');
var util = require('../utils/util.js');

app.get('/', util.isLoggedIn, function (req, res) {
    MatchResult.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

app.get('/:matchId', util.isLoggedIn, function (req, res) {
    var matchId = req.params.matchId;
    if (!matchId) {
        res.status(500).json(util.errorResponse.format('provide matchId'));
        return;
    }
    MatchResult.findOne({matchId: matchId}, function (err, obj) {
        if (err || !obj) {
            res.status(403).json(util.errorResponse.format('no match result'));
        } else {
            res.status(200).json(obj);
        }
    });
});

app.post('/', util.isAdmin, function (req, res) {
    var matchResult = req.body.matchResult;
    if (!matchResult) {
        res.status(500).json(util.errorResponse.format('provide matchResult'));
        return;
    }

    MatchResultService.updateMatchResult(matchResult).then(function (obj) {
        if (typeof(obj) === "undefined") {
            res.status(500).json(util.errorResponse.format('error'));
        } else {
            MatchResultService.updateMatchScore(matchResult).then(function (obj2) {
                UsersLeaderboardService.updateLeaderboard().then(function (obj3) {
                    res.status(200).json(util.okResponse);
                });
            });
        }
    });
});

module.exports = app;