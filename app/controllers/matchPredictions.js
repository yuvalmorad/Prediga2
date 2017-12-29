const express = require('express');
const app = express.Router();
const MatchPrediction = require('../models/matchPrediction');
const matchPredictionsService = require('../services/matchPredictionsService');
const util = require('../utils/util.js');
const groupConfigurationService = require('../services/groupConfigurationService');

app.get('/:userId', util.isLoggedIn, function (req, res) {
    const userId = req.params.userId;

    if (!userId) {
        res.status(403).json(util.getErrorResponse('provide userId'));
        return;
    }

    const user = req.user;
    const isForMe = user._id.toString() === userId || typeof(userId) === 'undefined';

    matchPredictionsService.getPredictionsByUserId(userId, isForMe).then(function (result) {
        res.status(200).json(result);
    });
});

app.get('/:matchId', util.isLoggedIn, function (req, res) {
    const matchId = req.params.matchId;
    if (!matchId) {
        res.status(403).json(util.getErrorResponse('provide matchId'));
        return;
    }

    const user = req.user;
    const isForMe = user._id.toString() === userId || typeof(userId) === 'undefined';

    const matchArr = [matchId];
    matchPredictionsService.getPredictionsByMatchIds(matchArr, isForMe).then(function (result) {
        res.status(200).json(result);
    });
});

app.get('/', util.isLoggedIn, function (req, res) {
    const user = req.user;
    matchPredictionsService.getPredictionsByUserId(undefined, false, user._id).then(function (result) {
        res.status(200).json(result);
    });
});

app.delete('/:id', util.isAdmin, function (req, res) {
    const id = req.params.id;
    if (!id) {
        res.status(403).json(util.getErrorResponse('provide id'));
        return;
    }
    MatchPrediction.findOneAndRemove({_id: id}, function (err, obj) {
        if (err) {
            res.status(403).json(util.getErrorResponse('error'));
        } else {
            res.status(200).json(util.okResponse);
        }
    });
});

app.post('/', util.isLoggedIn, function (req, res) {
    const matchPredictions = req.body.matchPredictions;
    if (!matchPredictions || !Array.isArray(matchPredictions)) {
        res.status(500).json(util.getErrorResponse('provide array of matchPredictions'));
        return;
    }
    const userId = req.user._id;

    groupConfigurationService.getConfigurationValue('minutesBeforeCloseMathPrediction').then(function (value) {
        return matchPredictionsService.createMatchPredictions(matchPredictions, userId, value).then(function (obj) {
            res.status(200).json(obj);
        }, function (msg) {
            res.status(500).json({error: msg});
        });
    });
});

module.exports = app;