var express = require('express');
var app = express.Router();
var Team = require('../models/team');
var util = require('../utils/util.js');
var Q = require('q');

app.get('/:teamId', util.isLoggedIn, function (req, res) {
    var teamId = req.params.teamId;
    if (!teamId) {
        res.status(200).json('provide teamId');
        return;
    }
    Team.findOne({_id: teamId}, function (err, obj) {
        if (err) {
            res.status(403).json(err.message);
        } else {
            res.status(200).json(obj);
        }
    });
});

app.delete('/:teamId', util.isAdmin, function (req, res) {
    var teamId = req.params.teamId;
    if (!teamId) {
        res.status(200).json('provide teamId');
        return;
    }
    Team.findOneAndRemove({_id: teamId}, function (err, obj) {
        if (err) {
            res.status(403).json(err.message);
        } else {
            res.status(200).json(obj);
        }
    });
});

app.get('/', util.isLoggedIn, function (req, res) {
    Team.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

app.post('/', util.isAdmin, function (req, res) {
    var teams = req.body.teams;
    if (!teams || !Array.isArray(teams)) {
        res.status(500).json('provide teams as payload');
        return;
    }

    createTeams(teams).then(function (obj) {
        res.status(200).json(obj);
    });
});

function createTeams(teams) {
    var deferred = Q.defer();
    var itemsProcessed = 0;
    teams.forEach(function (team) {
        Team.findOneAndUpdate({type: team.type}, team, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, obj) {
                if (err){
                    deferred.resolve(err.message);
                } else {
                    itemsProcessed++;
                    if (itemsProcessed === teams.length) {
                        deferred.resolve(teams);
                    }
                }
            }
        );
    });
    return deferred.promise;
}

module.exports = app;