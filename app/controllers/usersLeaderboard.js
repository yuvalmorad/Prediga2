var express = require('express');
var app = express.Router();
var UsersLeaderboard = require('../models/usersLeaderboard');
var util = require('../utils/util.js');
var Q = require('q');

app.get('/', util.isLoggedIn, function (req, res) {
    UsersLeaderboard.find({}, function (err, result) {
        if (err || !result) {
            res.status(403).json('error');
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = app;