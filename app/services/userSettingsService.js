const UserSettings = require('../models/userSettings');
const utils = require('../utils/util');

const self = module.exports = {
	setState: function (userId, key, state) {
		return self.findAndUpdate(userId, key, state);
	},
	getSettingsByUser: function (userId) {
		return UserSettings.find({userId: userId});
	},
	all: function () {
		return UserSettings.find({});
	},
	findAndUpdate: function (userId, key, value) {
		return UserSettings.findOneAndUpdate({userId: userId, key: key}, {
			userId: userId,
			key: key,
			value: value
		}, utils.updateSettings);
	},
	isValidInput: function (key, value) {
		if (value !== utils.USER_SETTINGS_VALUES.FALSE && value !== utils.USER_SETTINGS_VALUES.TRUE) {
			return false;
		}

		if (key !== utils.USER_SETTINGS_KEYS.PUSH_NOTIFICATION && key !== utils.USER_SETTINGS_KEYS.COPY_ALL_GROUPS && key !== utils.USER_SETTINGS_KEYS.RANDOM_ALL) {
			return false;
		}

		return true;
	}
};