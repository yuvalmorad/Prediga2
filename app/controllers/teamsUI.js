let express = require('express');
let app = express.Router();
let Team = require('../models/team');
let teamPredictionsService = require('../services/teamPredictionsService');
let util = require('../utils/util.js');
let TeamResult = require('../models/teamResult');
let League = require('../models/league');

app.get('/', util.isLoggedIn, function (req, res) {
    let user = req.user;
    getData(user._id).then(function (teamsCombined) {
        res.status(200).json(teamsCombined);
    });
});

function getData(me) {
    return Promise.all([
        // TODO - find user's groups + group's leagues
        League.find({})
    ]).then(function (arr2) {
        let leagueIds = arr2[0].map(function (league) {
            return league._id;
        });

        return Promise.all([
            Team.find({league: {$in: leagueIds}})
        ]).then(function (arr1) {
            let teams = arr1[0];
            let teamIds = arr1[0].map(function (team) {
                return team._id;
            });

            return Promise.all([
                teamPredictionsService.getPredictionsByUserId(me, true, me, teamIds),
                TeamResult.find({teamId: {$in: teamIds}})
            ]).then(function (arr) {
                return {
                    teams: teams,
                    predictions: arr[0],
                    results: arr[1]
                }
            });
        });
    });
}

module.exports = app;