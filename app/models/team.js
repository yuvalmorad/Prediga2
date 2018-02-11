// load the things we need
const mongoose = require('mongoose');

// define the schema for our teams model
const teamSchema = mongoose.Schema({
	deadline: Date,
	resultTime: Date,
	title: String,
	type: String,
	league: String,
	options: [String]
});

teamSchema.options.toJSON = {
	transform: function (doc, ret, options) {
		delete ret.__v;
		return ret;
	}
};

module.exports = mongoose.model('Team', teamSchema);