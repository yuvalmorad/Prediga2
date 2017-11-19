var express = require('express');
var app = express.Router();
var PredictionScoreConfiguration = require('../models/predictionScoreConfiguration');
var util = require('../utils/util.js');
var Q = require('q');

app.get('/', util.isLoggedIn, function (req, res) {
    PredictionScoreConfiguration.find({}, function (err, result) {
        if (err || !result) {
            res.status(403).json('error');
        } else {
            res.status(200).json(result);
        }
    });
});

app.post('/', util.isAdmin, function (req, res) {
    var predictionScoreConfiguration = req.body.predictionScoreConfiguration;
    if (!predictionScoreConfiguration) {
        res.status(500).json({});
        return;
    }

    createConfiguration(predictionScoreConfiguration).then(function (obj) {
        res.status(200).json(obj);
    });
});

function createConfiguration(predictionScoreConfiguration) {
    var deferred = Q.defer();
    PredictionScoreConfiguration.findOneAndUpdate({}, predictionScoreConfiguration, {
            upsert: true,
            setDefaultsOnInsert: true
        }, function (err, obj) {
            if (err) {
                deferred.resolve('error');
            } else {
                deferred.resolve(obj);
            }
        }
    );
    return deferred.promise;
}

module.exports = app;