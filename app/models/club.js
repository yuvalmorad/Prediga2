// load the things we need
const mongoose = require('mongoose');

// define the schema for our clubs model
const clubSchema = mongoose.Schema({
	name: String,
	name365: String,
	shortName: String,
	colors: Array,
	buttonColors: Array,
	graphColors: Array,
	logoPosition: String
});

clubSchema.options.toJSON = {
	transform: function (doc, ret, options) {
		delete ret.__v;
		return ret;
	}
};

module.exports = mongoose.model('Club', clubSchema);