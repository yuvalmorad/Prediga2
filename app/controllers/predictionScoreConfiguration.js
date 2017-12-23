let express = require('express');
let app = express.Router();
let PredictionScoreConfiguration = require('../models/predictionScoreConfiguration');
let util = require('../utils/util.js');

app.get('/', util.isLoggedIn, function (req, res) {
    PredictionScoreConfiguration.find({}, function (err, result) {
        if (err || !result) {
            res.status(403).json(util.getErrorResponse('error'));
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = app;