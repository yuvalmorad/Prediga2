var express = require('express');
var app = express.Router();
var TeamPrediction = require('../models/teamPrediction');
var Team = require('../models/team');
var util = require('../utils/util.js');

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
    var userId = req.query.userId;
    TeamPrediction.find({userId: userId}, function (err, obj) {
        if (err) {
            res.status(403).json(util.errorResponse.format('error'));
        } else {
            res.status(200).json(obj);
        }
    });
});

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

    creaTeamPredictions(teamPredictions, userId).then(function (obj) {
        res.status(200).json(obj);
    }, function(msg){
        res.status(500).json({error: msg});
    });
});

function creaTeamPredictions(teamPredictions, userId) {
    var now = new Date();
    var promises = teamPredictions.map(function (teamPrediction) {
        // we can update only if the kickofftime is not passed
        return Team.findOne({deadline: {$gte: now}, _id: teamPrediction.teamId}).then(function(aTeam){
            if (aTeam) {
                teamPrediction.userId = userId;
                return TeamPrediction.findOneAndUpdate({teamId: teamPrediction.teamId, userId: userId}, teamPrediction, {
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