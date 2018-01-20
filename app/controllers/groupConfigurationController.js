const express = require('express');
const app = express.Router();
const groupConfigurationService = require('../services/groupConfigurationService');
const groupService = require('../services/groupService');
const util = require('../utils/util.js');

/**
 * By Id
 */
app.get('/:configurationId', util.isLoggedIn, function (req, res) {
	const configurationId = req.params.configurationId;
	if (!configurationId) {
		res.status(400).json({});
		return;
	}
	const userId = req.user._id;
	return groupService.byUsrIdAndConfigurationId(userId, configurationId).then(function (groups) {
		if (!groups) {
			// user is not part of any group of this configuration.
			res.status(403).json([]);
			return;
		}
		return groupConfigurationService.byId(configurationId).then(function (configuration) {
			if (!configuration) {
				res.status(200).json({});
			} else {
				res.status(200).json(configuration);
			}
		});
	});
});

/**
 * All configuration the user can see
 */
app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	return groupService.byUserId(userId).then(function (groups) {
		if (!groups) {
			res.status(400).json([]);
			return;
		}

		let configurationIdArr = groupService.getConfigurationIdMap(groups);
		return groupConfigurationService.byIds(configurationIdArr).then(function (configurations) {
			if (!configurations) {
				res.status(200).json([]);
			} else {
				res.status(200).json(configurations);
			}
		});
	});
});

module.exports = app;