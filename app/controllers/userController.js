const express = require('express');
const app = express.Router();
const userService = require('../services/userService');
const groupService = require('../services/groupService');
const util = require('../utils/util.js');

/**
 * By UserId
 */
app.get('/:userId', util.isLoggedIn, function (req, res) {
	const userId = req.params.userId;
	if (!userId) {
		res.status(400).json(util.getErrorResponse());
		return;
	}
	return userService.byId(userId).then(function (user) {
		res.status(200).json(user);
	});
});

/**
 * All users in the same groups
 */
app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	return groupService.byUserId(userId).then(function (groups) {
		if (!groups) {
			res.status(200).json([]);
		}

		let userIds = groupService.getUsersMap(groups);
		return userService.byIds(userIds).then(function (usersInGroup) {
			res.status(200).json(usersInGroup);
		})
	});
});

/**
 * Get Users by Ids
 * This is POST and not GET because we want to get list of users in body.
 */
app.post('/', util.isLoggedIn, function (req, res) {
	const ids = req.body.ids;
	if (!ids || !Array.isArray(ids)) {
		res.status(400).json(util.getErrorResponse());
		return;
	}
	return userService.byIds(ids).then(function (users) {
		res.status(200).json(users);
	});
});


module.exports = app;