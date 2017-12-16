var express = require('express');
var app = express.Router();
var MatchResult = require('../models/matchResult');
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

app.delete('/:matchId', util.isAdmin, function (req, res) {
    var matchId = req.params.matchId;
    if (!matchId) {
        res.status(500).json(util.errorResponse.format('provide matchId'));
        return;
    }
    MatchResult.findOneAndRemove({matchId: matchId}, function (err, obj) {
        if (err || !obj) {
            res.status(500).json('error');
        } else {
            res.status(200).json(util.okResponse);
        }
    });
});

module.exports = app;