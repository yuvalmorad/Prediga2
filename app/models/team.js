// load the things we need
const mongoose = require('mongoose');

// define the schema for our teams model
const teamSchema = mongoose.Schema({
	deadline: Date,
	title: String,
	type: String, // `winner`, `runnerUp`
	league: String,
	options: Array
});

teamSchema.options.toJSON = {
	transform: function (doc, ret, options) {
		delete ret.__v;
		return ret;
	}
};

module.exports = mongoose.model('Team', teamSchema);