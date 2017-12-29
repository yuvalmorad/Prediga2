const express = require('express');
const app = express.Router();
const groupConfiguration = require('../models/groupConfiguration');
const util = require('../utils/util.js');

app.get('/', util.isLoggedIn, function (req, res) {
	groupConfiguration.find({}, function (err, result) {
		if (err || !result) {
			res.status(403).json(util.getErrorResponse('error'));
		} else {
			res.status(200).json(result);
		}
	});
});

module.exports = app;