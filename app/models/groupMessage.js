// load the things we need
const mongoose = require('mongoose');

// define the schema for our match result model
const GroupmessageSchema = mongoose.Schema({
    userId: String,
    groupId: String,
    message: String,
    creationDate: {default: Date.now, type: Date}
});

GroupmessageSchema.options.toJSON = {
	transform: function (doc, ret, options) {
		delete ret.__v;
		return ret;
	}
};

module.exports = mongoose.model('GroupMessage', GroupmessageSchema);