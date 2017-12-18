let express = require('express');
let app = express.Router();
let MatchPrediction = require('../models/matchPrediction');
let matchPredictionsService = require('../services/matchPredictionsService');
let util = require('../utils/util.js');

app.get('/:userId', util.isLoggedIn, function (req, res) {
    let userId = req.params.userId;
    if (!userId) {
        res.status(403).json(util.errorResponse.format('provide userId'));
        return;
    }

    MatchPrediction.find({userId: userId}, function (err, obj) {
        res.status(200).json(obj);
    });
});

app.get('/:matchId', util.isLoggedIn, function (req, res) {
    let matchId = req.params.matchId;
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
    let id = req.params.id;
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
    let matchPredictions = req.body.matchPredictions;
    let userId = req.user._id;
    if (!matchPredictions || !Array.isArray(matchPredictions)) {
        res.status(500).json(util.errorResponse.format('provide array of matchPredictions'));
        return;
    }

    matchPredictionsService.createMatchPredictions(matchPredictions, userId).then(function (obj) {
        res.status(200).json(obj);
    }, function (msg) {
        res.status(500).json({error: msg});
    });
});

module.exports = app;