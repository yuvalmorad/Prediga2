const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const PushSubscriptionService = require('../services/pushSubscriptionService');
const UserSettingsService = require('../services/userSettingsService');

app.get('/', util.isLoggedIn, function (req, res) {
    const userId = req.user._id;
    UserSettingsService.getSettingsByUser(userId).then(function(userSettingsRes) {
        res.status(200).json(userSettingsRes);
    })
});

app.post('/enablePush', util.isLoggedIn, function (req, res) {
    const userId = req.user._id;
    const pushSubscriptionObj = req.body.pushSubscription;

    Promise.all([
        PushSubscriptionService.subscribeUserToPushNotification(userId, pushSubscriptionObj),
        UserSettingsService.setPushNotificationState(userId, "true")
    ]).then(function(){
        UserSettingsService.getSettingsByUser(userId).then(function(userSettingsRes) {
            res.status(200).json(userSettingsRes);
        });
    });
});

app.post('/disablePush', util.isLoggedIn, function (req, res) {
    const userId = req.user._id;
    Promise.all([
        PushSubscriptionService.removeAllByUser(userId),
        UserSettingsService.setPushNotificationState(userId, "false")
    ]).then(function(){
        UserSettingsService.getSettingsByUser(userId).then(function(userSettingsRes) {
            res.status(200).json(userSettingsRes);
        });
	});
});

module.exports = app;