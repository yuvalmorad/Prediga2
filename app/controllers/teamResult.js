const express = require('express');
const app = express.Router();
const TeamResult = require('../models/teamResult');
const util = require('../utils/util.js');

app.get('/', util.isLoggedIn, function (req, res) {
	TeamResult.find({}, function (err, obj) {
		res.status(200).json(obj);
	});
});

app.get('/:teamId', util.isLoggedIn, function (req, res) {
	const teamId = req.params.teamId;
	if (!teamId) {
		res.status(500).json(util.getErrorResponse('provide teamId'));
		return;
	}
	TeamResult.findOne({teamId: teamId}, function (err, obj) {
		if (err || !obj) {
			res.status(403).json(util.getErrorResponse('no team result'));
		} else {
			res.status(200).json(obj);
		}
	});
});
module.exports = app;