const GroupMessage = require('../models/groupMessage');

const self = module.exports = {
    getAllMessagesByGroup: function (groupId) {
		return GroupMessage.find({groupId: groupId});
	},

    getCountMessagesOfGroupFromDate: function(groupId, date) {
        return GroupMessage.count({groupId: groupId, creationDate: {$gt: date}});
    },

    createMessageGroup: function (message) {
        return GroupMessage.create(message);
	}
};