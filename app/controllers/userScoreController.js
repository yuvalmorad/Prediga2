const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const userScoreService = require('../services/userScoreService');

/**
 * All
 */
app.get('/', util.isAdmin, function (req, res) {
	return userScoreService.all().then(function (userScores) {
		res.status(200).json(userScores);
	});
});

app.get('/user/:userId/league/:leagueId/group/:groupId', util.isLoggedIn, function (req, res) {
    const userId = req.params.userId;
    const leagueId = req.params.leagueId;
    const groupId = req.params.groupId;
    return userScoreService.byUserIdLeagueIdGroupId(userId, leagueId, groupId).then(function (userScores) {
        res.status(200).json(userScores);
    });
});
app.get('/user/:userId/league/:leagueId', util.isLoggedIn, function (req, res) {
    const userId = req.params.userId;
    const leagueId = req.params.leagueId;
    return userScoreService.byUserIdLeagueId(userId, leagueId).then(function (userScores) {
        res.status(200).json(userScores);
    });
});
app.get('/user/:userId/group/:groupId', util.isLoggedIn, function (req, res) {
    const userId = req.params.userId;
    const groupId = req.params.groupId;
    return userScoreService.byUserIdGroupId(userId, groupId).then(function (userScores) {
        res.status(200).json(userScores);
    });
});
app.get('/group/:groupId', util.isLoggedIn, function (req, res) {
    const groupId = req.params.groupId;
    return userScoreService.byGroupId(groupId).then(function (userScores) {
        res.status(200).json(userScores);
    });
});
module.exports = app;