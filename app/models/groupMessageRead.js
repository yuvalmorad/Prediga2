// load the things we need
const mongoose = require('mongoose');

// define the schema for our match result model
const groupMessageReadSchema = mongoose.Schema({
    userId: String,
    groupId: String,
    lastReadDate: {default: Date.now, type: Date}
});

groupMessageReadSchema.options.toJSON = {
	transform: function (doc, ret, options) {
		delete ret.__v;
		return ret;
	}
};

module.exports = mongoose.model('GroupMessageRead', groupMessageReadSchema);