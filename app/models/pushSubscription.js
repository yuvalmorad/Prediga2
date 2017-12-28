let mongoose = require('mongoose');

let pushSubscriptionSchema = mongoose.Schema({
    userId: String,
    pushSubscriptions: Array
});

pushSubscriptionSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('PushSubscription', pushSubscriptionSchema);