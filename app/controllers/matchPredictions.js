var express = require('express');
var app = express.Router();
var MatchPrediction = require('../models/matchPrediction');
var Match = require('../models/match');
var util = require('../utils/util.js');

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

    MatchPrediction.find({matchId: matchId}, function (err, obj) {
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
    }, function (msg) {
        res.status(500).json({error: msg});
    });
});

function createMatchPredictions(matchPredictions, userId) {
    var now = new Date();
    var promises = matchPredictions.map(function (matchPrediction) {
        // we can update only if the kickofftime is not passed
        return Match.findOne({kickofftime: {$gte: now}, _id: matchPrediction.matchId}).then(function (aMatch) {
            if (aMatch) {
                // fixing wrong input
                if (typeof(matchPrediction.winner) === 'undefined') {
                    matchPrediction.winner = 'Draw';
                }
                if (typeof(matchPrediction.firstToScore) === 'undefined') {
                    matchPrediction.firstToScore = 'None';
                }
                // validation:
                if (((matchPrediction.winner !== aMatch.team1) && (matchPrediction.winner !== aMatch.team2) && (matchPrediction.winner !== "Draw")) ||
                    ((matchPrediction.firstToScore !== aMatch.team1) && (matchPrediction.firstToScore !== aMatch.team2) && matchPrediction.firstToScore !== "None") ||
                    matchPrediction.team1Goals < 0 || matchPrediction.team2Goals < 0 || matchPrediction.goalDiff < 0) {
                    return Promise.reject('general error');
                }

                matchPrediction.userId = userId;
                return MatchPrediction.findOneAndUpdate({
                    matchId: matchPrediction.matchId,
                    userId: userId
                }, matchPrediction, {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                });
            } else {
                return Promise.reject('general error');
            }
        });
    });

    return Promise.all(promises);
}

module.exports = app;