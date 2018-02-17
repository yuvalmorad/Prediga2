const UserSettings = require('../models/userSettings');
const utils = require('../utils/util');
const KEYS = {
	PUSH_NOTIFICATION: "PUSH_NOTIFICATION"
};

function findAndUpdate(userId, key, value) {
    return UserSettings.findOneAndUpdate({userId: userId, key: key}, {
        userId: userId,
		key: key,
		value: value
    }, utils.updateSettings);
}

const self = module.exports = {
	setPushNotificationState: function(userId, state) {
		return findAndUpdate(userId, KEYS.PUSH_NOTIFICATION, state);
	},
	getSettingsByUser: function(userId) {
        return UserSettings.find({userId: userId});
	}
};