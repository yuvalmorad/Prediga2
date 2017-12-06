var express = require('express');
var app = express.Router();
var TeamResult = require('../models/teamResult');
var TeamResultService = require('../services/teamResultService');
var UsersLeaderboardService = require('../services/leaderboardService');
var util = require('../utils/util.js');

app.get('/', util.isLoggedIn, function (req, res) {
    TeamResult.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

app.get('/:teamId', util.isLoggedIn, function (req, res) {
    var teamId = req.params.teamId;
    if (!teamId) {
        res.status(500).json(util.errorResponse.format('provide teamId'));
        return;
    }
    TeamResult.findOne({teamId: teamId}, function (err, obj) {
        if (err || !obj) {
            res.status(403).json(util.errorResponse.format('no team result'));
        } else {
            res.status(200).json(obj);
        }
    });
});

app.post('/', util.isAdmin, function (req, res) {
    var teamResult = req.body.teamResult;
    if (!teamResult) {
        res.status(500).json(util.errorResponse.format('provide teamResult'));
        return;
    }

    TeamResultService.updateTeamResult(teamResult).then(function (obj) {
        if (typeof(obj) === "undefined") {
            res.status(500).json(util.errorResponse.format('error'));
        } else {
            TeamResultService.updateTeamScore(teamResult).then(function (obj2) {
                UsersLeaderboardService.updateLeaderboard().then(function (obj3) {
                    res.status(200).json(util.okResponse);
                });
            });
        }
    });
});

module.exports = app;