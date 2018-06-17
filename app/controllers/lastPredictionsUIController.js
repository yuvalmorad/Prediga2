const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const matchService = require('../services/matchService');
const matchPredictionsService = require('../services/matchPredictionsService');
const matchResultService = require('../services/matchResultService');
const teamService = require('../services/teamService');
const teamPredictionsService = require('../services/teamPredictionsService');
const teamResultService = require('../services/teamResultService');
const userService = require('../services/userService');

/**
 * Get data for Single User Last Prediction screen
 */
app.get('/:userId', util.isLoggedIn, function (req, res) {
    const requestUserId = req.params.userId;
    const leagueId = req.query.leagueId;
    if (!leagueId) {
        res.status(400).json({});
    }
    let groupId = req.query.groupId;
    if (!groupId || groupId === 'undefined') {
        groupId = util.DEFAULT_GROUP;
    }
    const loggedInUser = req.user._id;
    let request = {
        userId: requestUserId,
        isForMe: userService.isMe(loggedInUser, requestUserId),
        me: loggedInUser,
        groupId: groupId,
        leagueId: leagueId
    };
    getData(request).then(function (obj) {
        getDataForTeams(request).then(function (obj2) {
            obj.teams = obj2.teams;
            obj.teamPrediction = obj2.teamPrediction;
            obj.teamResults = obj2.teamResults;
            res.status(200).json(obj);
        });
    });
});

function getData(request) {
    let emptyObj = {
        predictions: [],
        results: [],
        matches: []
    };
    return matchPredictionsService.getPredictionsByUserId(request).then(function (userPredictions) {
        if (!userPredictions) {
            return Promise.resolve(emptyObj);
        }
        const matchIds = matchPredictionsService.getMatchIdsArr(userPredictions);
        return matchResultService.byMatchIdsAndAndActiveStatus(matchIds, false).then(function (matchResults) {
            if (!matchResults) {
                return Promise.resolve(emptyObj);
            }
            const finishedMatchIds = matchResultService.getMatchIdsArr(matchResults);
            const userPredictionsFinished = userPredictions.filter(function (prediction) {
                return finishedMatchIds.indexOf(prediction.matchId) >= 0;
            });

            return matchService.byLeagueIdAndIdsWithLimit(request.leagueId, finishedMatchIds, util.LAST_PREDICTIONS_LIMIT_UI).then(function (finishedMatches) {
                if (!finishedMatches) {
                    return emptyObj;
                } else {
                    return {
                        predictions: userPredictionsFinished,
                        results: matchResults,
                        matches: finishedMatches
                    };
                }
            });
        });
    });
}

function getDataForTeams(request) {
    let emptyObj = {
        teamPrediction: [],
        teamResults: [],
        teams: []
    };
    return teamPredictionsService.getPredictionsByUserId(request).then(function (userPredictions) {
        if (!userPredictions) {
            return Promise.resolve(emptyObj);
        }
        const teamIds = teamPredictionsService.getTeamIdsArr(userPredictions);
        return teamResultService.byTeamIds(teamIds).then(function (teamResults) {
            return teamService.byLeagueIdAndIdsDeadlinePass(request.leagueId, teamIds).then(function (teamsData) {
                const teamClosedIds = teamService.getIdsArr(teamsData);
                const userPredictionsClosed = userPredictions.filter(function (prediction) {
                    return teamClosedIds.indexOf(prediction.teamId) >= 0;
                });
                if (teamResults.length == 0) {
                    // fake team result to see it in the UI until we will have result.
                    // fill the prediction
                    userPredictionsClosed.forEach(function (teamPrediction) {
                        teamResults.push({
                            teamId: teamPrediction.teamId,
                            team: "N/A"
                        });
                    });
                    // fill the type:
                    teamResults.forEach(function (teamResultObj) {
                        teamsData.forEach(function (teamObj) {
                            if (teamResultObj.teamId.toString() === teamObj._id.toString()) {
                                teamResultObj.type = teamObj.type;
                            }
                        });
                    });
                }

                return {
                    teamPrediction: userPredictionsClosed,
                    teamResults: teamResults,
                    teams: teamsData
                };
            });
        });
    });
}

module.exports = app;