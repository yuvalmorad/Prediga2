// load the things we need
const mongoose = require('mongoose');

// define the schema for our group model
const groupSchema = mongoose.Schema({
	configurationId: String,
	creationDate: {default: Date.now, type: Date},
	createdBy: String,
	icon: String,
	iconColor: String,
	leagueIds: [String],
	name: String,
	secret: String,
	users: [String]
});

groupSchema.options.toJSON = {
	transform: function (doc, ret, options) {
		delete ret.__v;
		delete ret.secret;
		return ret;
	}
};

module.exports = mongoose.model('Group', groupSchema);