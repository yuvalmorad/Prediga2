const mongoose = require('mongoose');

const teamCategorySchema = mongoose.Schema({
    league: String,
    title: String,
	description: String,
    icon: String
});

teamCategorySchema.options.toJSON = {
	transform: function (doc, ret, options) {
		delete ret.__v;
		return ret;
	}
};

module.exports = mongoose.model('TeamCategory', teamCategorySchema);