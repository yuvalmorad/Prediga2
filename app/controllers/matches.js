var express = require('express');
var app = express.Router();
var Match = require('../models/match');
var util = require('../utils/util.js');
var Q = require('q');

app.get('/:matchId', util.isLoggedIn, function (req, res) {
    var matchId = req.params.matchId;
    if (!matchId) {
        res.status(200).json('provide matchId');
        return;
    }
    Match.findOne({_id: matchId}, function (err, obj) {
        if (err) {
            res.status(403).json(err.message);
        } else {
            res.status(200).json(obj);
        }
    });
});

app.delete('/:matchId', util.isAdmin, function (req, res) {
    var matchId = req.params.matchId;
    if (!matchId) {
        res.status(403).json('provide matchId');
        return;
    }
    Match.findOneAndRemove({_id: matchId}, function (err, obj) {
        if (err) {
            res.status(403).json(err.message);
        } else {
            res.status(200).json(obj);
        }
    });
});

app.get('/', util.isLoggedIn, function (req, res) {
    var type = req.query.type;
    if (!type) {
        Match.find({}, function (err, obj) {
            res.status(200).json(obj);
        });
    } else {
        Match.find({type: type}, function (err, obj) {
            res.status(200).json(obj);
        });
    }
});

app.post('/', util.isAdmin, function (req, res) {
    var matches = req.body.matches;
    if (!matches || !Array.isArray(matches)) {
        res.status(500).json('provide matches as payload');
        return;
    }

    createMatches(matches).then(function (obj) {
        res.status(200).json(obj);
    });
});

function createMatches(matches) {
    var deferred = Q.defer();
    var itemsProcessed = 0;
    matches.forEach(function (match) {
        Match.findOneAndUpdate({team1: match.team1, team2: match.team2}, match, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, obj) {
                if (err) {
                    deferred.resolve(err.message);
                } else {
                    itemsProcessed++;
                    if (itemsProcessed === matches.length) {
                        deferred.resolve(matches);
                    }
                }
            }
        );
    });
    return deferred.promise;
}

module.exports = app;