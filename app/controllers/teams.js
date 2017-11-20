var express = require('express');
var app = express.Router();
var Team = require('../models/team');
var util = require('../utils/util.js');

app.get('/:teamId', util.isLoggedIn, function (req, res) {
    var teamId = req.params.teamId;
    if (!teamId) {
        res.status(500).json(util.errorResponse.format('provide teamId'));
        return;
    }
    Team.findOne({_id: teamId}, function (err, obj) {
        if (err) {
            res.status(403).json(util.errorResponse.format('error'));
        } else {
            res.status(200).json(obj);
        }
    });
});

app.delete('/:teamId', util.isAdmin, function (req, res) {
    var teamId = req.params.teamId;
    if (!teamId) {
        res.status(500).json(util.errorResponse.format('provide teamId'));
        return;
    }
    Team.findOneAndRemove({_id: teamId}, function (err, obj) {
        if (err) {
            res.status(403).json(util.errorResponse.format('error'));
        } else {
            res.status(200).json(util.okResponse);
        }
    });
});

app.get('/', util.isLoggedIn, function (req, res) {
    Team.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

app.post('/', util.isAdmin, function (req, res) {
    var teams = req.body.teams;
    if (!teams || !Array.isArray(teams)) {
        res.status(500).json(util.errorResponse.format('provide teams'));
        return;
    }

    util.createTeams(teams).then(function (obj) {
        res.status(200).json(obj);
    });
});

module.exports = app;