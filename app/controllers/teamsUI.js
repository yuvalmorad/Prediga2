let express = require('express');
let app = express.Router();
let Team = require('../models/team');
let teamPredictionsService = require('../services/teamPredictionsService');
let util = require('../utils/util.js');
let TeamResult = require('../models/teamResult');

app.get('/', util.isLoggedIn, function (req, res) {
    let user = req.user;
    getData(user._id).then(function (teamsCombined) {
        res.status(200).json(teamsCombined);
    });
});

function getData(me) {
    return Promise.all([
        Team.find({}),
        teamPredictionsService.getPredictionsByUserId(undefined, false, me),
        TeamResult.find({})
    ]).then(function (arr) {
        return {
            teams: arr[0],
            predictions: arr[1],
            results: arr[2]
        }
    });
}

module.exports = app;