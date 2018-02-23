const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const PushSubscriptionService = require('../services/pushSubscriptionService');
const UserSettingsService = require('../services/userSettingsService');

app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	UserSettingsService.getSettingsByUser(userId).then(function (userSettingsRes) {
		res.status(200).json(userSettingsRes);
	})
});

app.put('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	let key = req.query.key;
	let value = req.query.value;

	if (!UserSettingsService.isValidInput(key, value)) {
		res.status(400).json(util.getErrorResponse());
	}

	UserSettingsService.setState(userId, key, value).then(function () {
		if (key === util.USER_SETTINGS_KEYS.PUSH_NOTIFICATION) {
			if (value === util.USER_SETTINGS_VALUES.FALSE) {
				PushSubscriptionService.removeAllByUser(userId)
			} else if (value === util.USER_SETTINGS_VALUES.TRUE) {
				PushSubscriptionService.subscribeUserToPushNotification(userId, req.body.pushSubscription);
			}
		}

		UserSettingsService.getSettingsByUser(userId).then(function (userSettingsRes) {
			res.status(200).json(userSettingsRes);
		});
	});
});

module.exports = app;