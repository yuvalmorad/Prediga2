let express = require('express');
let app = express.Router();
let Team = require('../models/team');
let util = require('../utils/util.js');

app.get('/:teamId', util.isLoggedIn, function (req, res) {
    let teamId = req.params.teamId;
    if (!teamId) {
        res.status(500).json(util.getErrorResponse('provide teamId'));
        return;
    }
    Team.findOne({_id: teamId}, function (err, obj) {
        if (err) {
            res.status(403).json(util.getErrorResponse('error'));
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

app.delete('/:teamId', util.isAdmin, function (req, res) {
    var teamId = req.params.teamId;
    if (!teamId) {
        res.status(500).json(util.getErrorResponse('provide teamId'));
        return;
    }
    Team.findOneAndRemove({_id: teamId}, function (err, obj) {
        if (err) {
            res.status(403).json(util.getErrorResponse('error'));
        } else {
            res.status(200).json(util.okResponse);
        }
    });
});

module.exports = app;