var express = require('express');
var app = express.Router();
var Match = require('../models/match');
var util = require('../utils/util.js');
var Q = require('q');

app.get('/:matchId', util.isLoggedIn, function (req, res) {
    var matchId = req.params.matchId;
    if (!matchId) {
        res.status(200).json({});
        return;
    }
    Match.findOne({_id: matchId}, function (err, obj) {
        if (err || !obj) {
            res.status(403).json({});
        } else {
            res.status(200).json(obj);
        }
    });
});

app.delete('/:matchId', util.isAdmin, function (req, res) {
    var matchId = req.params.matchId;
    if (!matchId) {
        res.status(403).json({});
        return;
    }
    Match.findOneAndRemove({_id: matchId}, function (err, obj) {
        if (err || !obj) {
            res.status(403).json({});
        } else {
            res.status(200).json('{}');
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
        res.status(500).json({});
        return;
    }

    createMatches(matches).then(function (obj) {
        res.status(200).json(matches);
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
                itemsProcessed++;
                if (itemsProcessed === matches.length) {
                    deferred.resolve({});
                }
            }
        );
    });
    return deferred.promise;
}

module.exports = app;