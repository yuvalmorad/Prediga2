const mongoose = require('mongoose');

const userSettings = mongoose.Schema({
    userId: String,
	key: {type: String},
	value: {type: String}
});

userSettings.options.toJSON = {
	transform: function (doc, ret, options) {
		delete ret.__v;
		return ret;
	}
};

module.exports = mongoose.model('UserSettings', userSettings);