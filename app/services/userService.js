const User = require('../models/user');

const self = module.exports = {
	isMe: function (userId, userId2) {
		return userId.toString() === userId2.toString();
	},
	byId: function (userId) {
		return User.findOne({_id: userId});
	},
	byIds: function (userIds) {
		return User.find({_id: {$in: userIds}});
	},
	all: function () {
		return User.find({});
	},
    getIdArr: function (users) {
        return users.map(function (user) {
            return user._id.toString();
        });
    }
};