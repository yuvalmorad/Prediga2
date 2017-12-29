const express = require('express');
const app = express.Router();
const Team = require('../models/team');
const teamPredictionsService = require('../services/teamPredictionsService');
const util = require('../utils/util.js');
const TeamResult = require('../models/teamResult');
const League = require('../models/league');

app.get('/', util.isLoggedIn, function (req, res) {
    const user = req.user;
    getData(user._id).then(function (teamsCombined) {
        res.status(200).json(teamsCombined);
    });
});

function getData(me) {
    return Promise.all([
        // TODO - find user's groups + group's leagues
        League.find({})
    ]).then(function (arr2) {
        const leagueIds = arr2[0].map(function (league) {
            return league._id;
        });

        return Promise.all([
            Team.find({league: {$in: leagueIds}})
        ]).then(function (arr1) {
            const teams = arr1[0];
            const teamIds = arr1[0].map(function (team) {
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