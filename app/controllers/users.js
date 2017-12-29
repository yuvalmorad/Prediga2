const express = require('express');
const app = express.Router();
const User = require('../models/user');
const util = require('../utils/util.js');

app.get('/:userId', util.isLoggedIn, function (req, res) {
	const userId = req.params.userId;
	if (!userId) {
		res.status(500).json(util.getErrorResponse('provide userId'));
		return;
	}
	User.findOne({_id: userId}, function (err, obj) {
		if (err || !obj) {
			res.status(403).json(util.getErrorResponse('error'));
		} else {
			res.status(200).json(obj);
		}
	});
});

app.delete('/:userId', util.isAdmin, function (req, res) {
	const userId = req.params.userId;
	if (!userId) {
		res.status(500).json(util.getErrorResponse('provide userId'));
		return;
	}
	User.findOneAndRemove({_id: userId}, function (err, obj) {
		if (err || !obj) {
			res.status(500).json(util.getErrorResponse('error'));
		} else {
			res.status(200).json(util.okResponse);
		}
	});
});

app.get('/', util.isLoggedIn, function (req, res) {
	User.find({}, function (err, obj) {
		if (err) {
			res.status(500).json(util.getErrorResponse('error'));
		} else {
			res.status(200).json(obj);
		}
	});

});


module.exports = app;