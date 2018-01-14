const express = require('express');
const app = express.Router();
const groupConfiguration = require('../models/groupConfiguration');
const Group = require('../models/group');
const util = require('../utils/util.js');

app.get('/:configurationId', util.isLoggedIn, function (req, res) {
	const configurationId = req.params.configurationId;
	if (!configurationId) {
		res.status(500).json(util.getErrorResponse('provide configurationId'));
		return;
	}
	const userId = req.user._id;
	return Promise.all([
		Group.find({users: userId, configurationId: configurationId})
	]).then(function (groups) {
		if (groups[0]) {
			return groupConfiguration.findOne({_id: configurationId}, function (err, relevantConfigs) {
				if (err) {
					res.status(500).json(util.getErrorResponse('error'));
				} else {
					res.status(200).json(relevantConfigs);
				}
			});
		} else {
			return [];
		}
	});
});

app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	return Promise.all([
		Group.find({users: userId})
	]).then(function (groups) {
		if (groups[0]) {
			const configurationIdArr = groups[0].map(function (group) {
				return group.configurationId;
			});
			let mergedConfigurationIdArr = [].concat.apply([], configurationIdArr);
			return groupConfiguration.find({_id: {$in: mergedConfigurationIdArr}}, function (err, relevantConfigs) {
				if (err) {
					res.status(500).json(util.getErrorResponse('error'));
				} else {
					res.status(200).json(relevantConfigs);
				}
			});
		} else {
			return [];
		}
	});
});

module.exports = app;