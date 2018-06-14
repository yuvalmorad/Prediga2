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
	},
    getPushUsers: function () {
        return self.all().then(function (userSettings) {
            if (!userSettings) {
                return Promise.resolve([]);
            }
            let usersWantsToGetPushArray = [];
            userSettings.forEach(function (userSetting) {
                if (userSetting.value === utils.USER_SETTINGS_VALUES.TRUE) {
                    if (userSetting.key === utils.USER_SETTINGS_KEYS.PUSH_NOTIFICATION) {
                        usersWantsToGetPushArray.push(userSetting.userId);
                    }
                }
            });
            return Promise.resolve(usersWantsToGetPushArray);
        });
    }
};