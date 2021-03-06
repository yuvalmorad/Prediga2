const mongoose = require('mongoose');

const pushSubscriptionSchema = mongoose.Schema({
	userId: String,
	pushSubscriptions: Array //array of objects
});

pushSubscriptionSchema.options.toJSON = {
	transform: function (doc, ret, options) {
		delete ret.__v;
		return ret;
	}
};

module.exports = mongoose.model('PushSubscription', pushSubscriptionSchema);