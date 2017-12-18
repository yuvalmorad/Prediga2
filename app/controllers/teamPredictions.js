let express = require('express');
let app = express.Router();
let TeamPrediction = require('../models/teamPrediction');
let teamPredictionsService = require('../services/teamPredictionsService');
let util = require('../utils/util.js');

app.get('/', util.isLoggedIn, function (req, res) {
    TeamPrediction.find({}, function (err, obj) {
        if (err) {
            res.status(403).json(util.errorResponse.format('error'));
        } else {
            res.status(200).json(obj);
        }
    });
});

app.get('/:userId', util.isLoggedIn, function (req, res) {
    let userId = req.query.userId;
    TeamPrediction.find({userId: userId}, function (err, obj) {
        if (err) {
            res.status(403).json(util.errorResponse.format('error'));
        } else {
            res.status(200).json(obj);
        }
    });
});

app.delete('/:id', util.isAdmin, function (req, res) {
    let id = req.params.id;
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
    let teamPredictions = req.body.teamPredictions;
    let userId = req.user._id;
    if (!teamPredictions || !Array.isArray(teamPredictions)) {
        res.status(500).json(util.errorResponse.format('provide teamPredictions'));
        return;
    }

    teamPredictionsService.creaTeamPredictions(teamPredictions, userId).then(function (obj) {
        res.status(200).json(obj);
    }, function (msg) {
        res.status(500).json({error: msg});
    });
});

module.exports = app;