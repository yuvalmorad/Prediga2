const express = require('express');
const app = express.Router();
const util = require('../utils/util');
const pushSubscriptionService = require('../services/pushSubscriptionService');

/**
 * Get user's push subscriptions
 */
app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	return pushSubscriptionService.byUserId(userId).then(function (pushObj) {
		if (pushObj) {
			res.status(200).json({pushSubscriptions: pushObj});
		} else {
			res.status(200).json({pushSubscriptions: []});
		}
	});
});

/**
 * Test push notification
 */
app.post('/pushTest', util.isAdmin, function (req, res) {
	return pushSubscriptionService.pushToAllRegisterdUsers({text: "push notification TEST from prediga!"}).then(function () {
		res.status(200).json({});
	});
});

module.exports = app;