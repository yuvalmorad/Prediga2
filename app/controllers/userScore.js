var express = require('express');
var app = express.Router();
var UserScore = require('../models/userScore');
var util = require('../utils/util.js');
var Q = require('q');

app.get('/', util.isAdmin, function (req, res) {
    UserScore.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

module.exports = app;