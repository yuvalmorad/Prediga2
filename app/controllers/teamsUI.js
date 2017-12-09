var express = require('express');
var app = express.Router();
var Team = require('../models/team');
var TeamPrediction = require('../models/teamPrediction');
var util = require('../utils/util.js');
var User = require('../models/user');
var TeamResult = require('../models/teamResult');

app.get('/', util.isLoggedIn, function (req, res) {
    getData().then(function (teamsCombined) {
        res.status(200).json(teamsCombined);
    });
});

function getData() {
    return Promise.all([
        Team.find({}),
        TeamPrediction.find({}),
        User.find({}),
        TeamResult.find({})
    ]).then(function (arr) {
        return {
            teams: arr[0],
            predictions: arr[1],
            users: arr[2],
            results: arr[3]
        }
    });
}

module.exports = app;