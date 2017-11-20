var express = require('express');
var app = express.Router();
var TeamPrediction = require('../models/teamPrediction');
var Team = require('../models/team');
var util = require('../utils/util.js');
var Q = require('q');

app.get('/allForAdmin', util.isAdmin, function (req, res) {
    TeamPrediction.find({}, function (err, obj) {
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
        TeamPrediction.find({userId: user._id}, function (err, obj) {
            if (err) {
                res.status(403).json(util.errorResponse.format('error'));
            } else {
                res.status(200).json(obj);
            }
        });
    } else { // show only prediction until deadline
        getOtherUsersPredictions(userId).then(function (obj) {
            res.status(200).json(obj);
        });
    }
});

function getOtherUsersPredictions(userId) {
    var deferred = Q.defer();
    var now = new Date();

    // 1. get all team until deadline
    Team.find({deadline: {$lt: now}}, function (err, obj) {
        var itemsProcessed = 0;
        var result = [];
        if (!obj || obj.length < 1) {
            deferred.resolve([]);
        }
        // 2. for each match get other's user predictions.
        obj.forEach(function (aTeam) {
            if (userId) {
                // get for one user
                TeamPrediction.findOne({teamId: aTeam._id, userId: userId}, function (err, aTeamPrediction) {
                    if (aTeamPrediction) {
                        result.push(aTeamPrediction);
                    }

                    itemsProcessed++;
                    if (itemsProcessed === obj.length) {
                        deferred.resolve(result);
                    }
                });
            } else {
                // get for all users
                TeamPrediction.find({teamId: aTeam._id}, function (err, aTeamPrediction) {
                    if (aTeamPrediction && aTeamPrediction.length > 0) {
                        result = result.concat(aTeamPrediction);
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
    TeamPrediction.findOneAndRemove({_id: id}, function (err, obj) {
        if (err) {
            res.status(403).json(util.errorResponse.format('error'));
        } else {
            res.status(200).json(util.okResponse);
        }
    });
});

app.post('/', util.isLoggedIn, function (req, res) {
    var teamPredictions = req.body.teamPredictions;
    var userId = req.user._id;
    if (!teamPredictions || !Array.isArray(teamPredictions)) {
        res.status(500).json(util.errorResponse.format('provide teamPredictions'));
        return;
    }

    createMatchPredictions(teamPredictions, userId).then(function (obj) {
        res.status(200).json(obj);
    });
});

function createMatchPredictions(teamPredictions, userId) {
    var deferred = Q.defer();
    var now = new Date();
    var itemsProcessed = 0;
    teamPredictions.forEach(function (teamPrediction) {
        // we can update only if the kickofftime is not passed
        Team.findOne({deadline: {$gte: now}, _id: teamPrediction.teamId}, function (err, obj) {
            if (obj) {
                teamPrediction.userId = userId;
                TeamPrediction.findOneAndUpdate({teamId: teamPrediction.teamId, userId: userId}, teamPrediction, {
                        upsert: true,
                        setDefaultsOnInsert: true
                    }, function (err, obj) {
                        if (err) {
                            deferred.resolve(util.errorResponse.format('error'));
                        } else {
                            itemsProcessed++;
                            if (itemsProcessed === teamPredictions.length) {
                                deferred.resolve(teamPredictions);
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