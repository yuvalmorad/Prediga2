var express = require('express');
var app = express.Router();
var PredictionScoreConfiguration = require('../models/predictionScoreConfiguration');
var util = require('../utils/util.js');

app.get('/', util.isLoggedIn, function (req, res) {
    PredictionScoreConfiguration.find({}, function (err, result) {
        if (err || !result) {
            res.status(403).json(util.errorResponse.format('error'));
        } else {
            res.status(200).json(result);
        }
    });
});

app.post('/', util.isAdmin, function (req, res) {
    var predictionScoreConfiguration = req.body.predictionScoreConfiguration;
    if (!predictionScoreConfiguration) {
        res.status(500).json(util.errorResponse.format('error'));
        return;
    }

    util.createConfiguration(predictionScoreConfiguration).then(function (obj) {
        res.status(200).json(obj);
    });
});

module.exports = app;