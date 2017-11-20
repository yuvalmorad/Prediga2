var express = require('express');
var app = express.Router();
var MatchPrediction = require('../models/matchPrediction');
var Match = require('../models/match');
var util = require('../utils/util.js');
var Q = require('q');

app.get('/allForAdmin', util.isAdmin, function (req, res) {
    MatchPrediction.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

app.get('/all', util.isLoggedIn, function (req, res) {
    getOtherUsersPredictions().then(function (obj) {
        res.status(200).json(obj);
    });
});

app.get('/', util.isLoggedIn, function (req, res) {
    var user = req.user;
    var userId = req.query.userId;
    var isSameUser = user._id === userId || typeof(userId) === 'undefined';

    // permit to show all
    if (isSameUser) {
        MatchPrediction.find({userId: user._id}, function (err, obj) {
            if (err) {
                res.status(403).json(util.errorResponse.format(err.message));
            } else {
                res.status(200).json(obj);
            }
        });
    } else { // show only prediction until kickofftime
        getOtherUsersPredictions(userId).then(function (obj) {
            res.status(200).json(obj);
        });
    }
});

function getOtherUsersPredictions(userId) {
    var deferred = Q.defer();
    var now = new Date();

    // 1. get all matches until kickofftime
    Match.find({kickofftime: {$lt: now}}, function (err, obj) {
        var itemsProcessed = 0;
        var result = [];
        if (!obj || obj.length < 1) {
            deferred.resolve([]);
        }
        // 2. for each match get other's user predictions.
        obj.forEach(function (aMatch) {
            if (userId) {
                // get for one user
                MatchPrediction.findOne({matchId: aMatch._id, userId: userId}, function (err, aMatchPrediction) {
                    if (aMatchPrediction) {
                        result.push(aMatchPrediction);
                    }

                    itemsProcessed++;
                    if (itemsProcessed === obj.length) {
                        deferred.resolve(result);
                    }
                });
            } else {
                // get for all users
                MatchPrediction.find({matchId: aMatch._id}, function (err, aMatchPredictions) {
                    if (aMatchPredictions && aMatchPredictions.length > 0) {
                        result = result.concat(aMatchPredictions);
                    }

                    itemsProcessed++;
                    if (itemsProcessed === obj.length) {
                        deferred.resolve(result);
                    }
                });
            }

        });
    });
    return deferred.promise;
}

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