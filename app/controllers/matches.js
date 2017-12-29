const express = require('express');
const app = express.Router();
const Match = require('../models/match');
const util = require('../utils/util.js');

app.get('/:matchId', util.isLoggedIn, function (req, res) {
	const matchId = req.params.matchId;
	if (!matchId) {
		res.status(500).json(util.getErrorResponse('provide matchId'));
		return;
	}
	Match.findOne({_id: matchId}, function (err, obj) {
		if (err) {
			res.status(403).json(util.getErrorResponse(err.message));
		} else {
			res.status(200).json(obj);
		}
	});
});

app.get('/', util.isLoggedIn, function (req, res) {
	const type = req.query.type;
	if (!type) {
		Match.find({}, function (err, obj) {
			res.status(200).json(obj);
		});
	} else {
		Match.find({type: type}, function (err, obj) {
			res.status(200).json(obj);
		});
	}
});

app.delete('/:matchId', util.isAdmin, function (req, res) {
	var matchId = req.params.matchId;
	if (!matchId) {
		res.status(403).json(util.getErrorResponse('provide matchId'));
		return;
	}
	Match.findOneAndRemove({_id: matchId}, function (err, obj) {
		if (err) {
			res.status(403).json(util.getErrorResponse(err.message));
		} else {
			res.status(200).json(obj);
		}
	});
});

module.exports = app;