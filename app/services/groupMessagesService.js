const GroupMessage = require('../models/groupMessage');

const self = module.exports = {
    getAllMessagesByGroup: function (groupId) {
		return GroupMessage.find({groupId: groupId});
	},

    createMessageGroup: function (message) {
        return GroupMessage.create(message);
	}
};