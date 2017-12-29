const express = require('express');
const app = express.Router();
const League = require('../models/league');
const util = require('../utils/util.js');

app.get('/:leagueId', util.isLoggedIn, function (req, res) {
    const leagueId = req.params.leagueId;
    if (!leagueId) {
        res.status(500).json(util.getErrorResponse('provide leagueId'));
        return;
    }
    League.findOne({_id: leagueId}, function (err, obj) {
        if (err) {
            res.status(403).json(util.getErrorResponse(err.message));
        } else {
            res.status(200).json(obj);
        }
    });
});

app.get('/', util.isLoggedIn, function (req, res) {
    League.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

module.exports = app;