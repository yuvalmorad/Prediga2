let express = require('express');
let app = express.Router();
let TeamPrediction = require('../models/teamPrediction');
let teamPredictionsService = require('../services/teamPredictionsService');
let util = require('../utils/util.js');

app.get('/', util.isLoggedIn, function (req, res) {
    let user = req.user;
    teamPredictionsService.getPredictionsByUserId(undefined, false, user._id).then(function (result) {
        res.status(200).json(result);
    });
});

app.get('/:userId', util.isLoggedIn, function (req, res) {
    let userId = req.params.userId;
    if (!userId) {
        res.status(403).json(util.getErrorResponse('provide userId'));
        return;
    }

    let user = req.user;
    let isForMe = user._id.toString() === userId || typeof(userId) === 'undefined';

    teamPredictionsService.getPredictionsByUserId(userId, isForMe).then(function (result) {
        res.status(200).json(result);
    });
});

app.delete('/:id', util.isAdmin, function (req, res) {
    let id = req.params.id;
    if (!id) {
        res.status(403).json(util.getErrorResponse('provide id'));
        return;
    }
    TeamPrediction.findOneAndRemove({_id: id}, function (err, obj) {
        if (err) {
            res.status(403).json(util.getErrorResponse('error'));
        } else {
            res.status(200).json(util.okResponse);
        }
    });
});

app.post('/', util.isLoggedIn, function (req, res) {
    let teamPredictions = req.body.teamPredictions;
    if (!teamPredictions || !Array.isArray(teamPredictions)) {
        res.status(500).json(util.getErrorResponse('provide teamPredictions'));
        return;
    }
    let userId = req.user._id;
    teamPredictionsService.creaTeamPredictions(teamPredictions, userId).then(function (obj) {
        res.status(200).json(obj);
    }, function (msg) {
        res.status(500).json({error: msg});
    });
});

module.exports = app;