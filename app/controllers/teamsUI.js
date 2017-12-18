let express = require('express');
let app = express.Router();
let Team = require('../models/team');
let TeamPrediction = require('../models/teamPrediction');
let util = require('../utils/util.js');
let User = require('../models/user');
let TeamResult = require('../models/teamResult');

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