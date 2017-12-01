var express = require('express');
var app = express.Router();
var MatchPrediction = require('../models/matchPrediction');
var Match = require('../models/match');
var util = require('../utils/util.js');
var Q = require('q');

app.get('/:userId', util.isLoggedIn, function (req, res) {
    var userId = req.params.userId;
    if (!userId) {
        res.status(403).json(util.errorResponse.format('provide userId'));
        return;
    }

    MatchPrediction.find({userId: userId}, function (err, obj) {
        res.status(200).json(obj);
    });
});

app.get('/:matchId', util.isLoggedIn, function (req, res) {
    var matchId = req.params.matchId;
    if (!matchId) {
        res.status(403).json(util.errorResponse.format('provide matchId'));
        return;
    }

    MatchPrediction.find({matchId: aMatch._id}, function (err, obj) {
        res.status(200).json(obj);
    });
});

app.get('/', util.isLoggedIn, function (req, res) {
    MatchPrediction.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

app.delete('/:id', util.isAdmin, function (req, res) {
    var id = req.params.id;
    if (!id) {
        res.status(403).json(util.errorResponse.format('provide id'));
        return;
    }
    MatchPrediction.findOneAndRemove({_id: id}, function (err, obj) {
        if (err) {
            res.status(403).json(util.errorResponse.format('error'));
        } else {
            res.status(200).json(util.okResponse);
        }
    });
});

app.post('/', util.isLoggedIn, function (req, res) {
    var matchPredictions = req.body.matchPredictions;
    var userId = req.user._id;
    if (!matchPredictions || !Array.isArray(matchPredictions)) {
        res.status(500).json(util.errorResponse.format('provide array of matchPredictions'));
        return;
    }

    createMatchPredictions(matchPredictions, userId).then(function (obj) {
        res.status(200).json(obj);
    });
});

function createMatchPredictions(matchPredictions, userId) {
    var deferred = Q.defer();
    var now = new Date();
    var itemsProcessed = 0;
    matchPredictions.forEach(function (matchPrediction) {
        // we can update only if the kickofftime is not passed
        Match.findOne({kickofftime: {$gte: now}, _id: matchPrediction.matchId}, function (err, obj) {
            if (obj) {
                matchPrediction.userId = userId;
                MatchPrediction.findOneAndUpdate({matchId: matchPrediction.matchId, userId: userId}, matchPrediction, {
                        upsert: true,
                        setDefaultsOnInsert: true
                    }, function (err, obj) {
                        if (err) {
                            deferred.resolve(util.errorResponse.format('error'));
                        } else {
                            itemsProcessed++;
                            if (itemsProcessed === matchPredictions.length) {
                                deferred.resolve(matchPredictions);
                            }
                        }
                    }
                );
            } else {
                // match cannot be updated.
                deferred.resolve(util.errorResponse.format('error'));
            }
        });

    });
    return deferred.promise;
}

module.exports = app;