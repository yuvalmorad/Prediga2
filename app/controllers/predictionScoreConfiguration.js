let express = require('express');
let app = express.Router();
let PredictionScoreConfiguration = require('../models/predictionScoreConfiguration');
//var PredictionScoreConfigurationService = require('../services/predictionScoreConfigurationService');
let util = require('../utils/util.js');

app.get('/', util.isLoggedIn, function (req, res) {
    PredictionScoreConfiguration.find({}, function (err, result) {
        if (err || !result) {
            res.status(403).json(util.errorResponse.format('error'));
        } else {
            res.status(200).json(result);
        }
    });
});

/*
Available only via initial data setup
app.post('/', util.isAdmin, function (req, res) {
    var predictionScoreConfiguration = req.body.predictionScoreConfiguration;
    if (!predictionScoreConfiguration) {
        res.status(500).json(util.errorResponse.format('error'));
        return;
    }

    PredictionScoreConfigurationService.updateConfiguration(predictionScoreConfiguration).then(function (obj) {
        res.status(200).json(obj);
    });
});
*/

module.exports = app;