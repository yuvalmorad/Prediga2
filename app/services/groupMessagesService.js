const GroupMessage = require('../models/groupMessage');

const self = module.exports = {
    getAllMessagesByGroup: function (groupId) {
		return GroupMessage.find({groupId: groupId});
	},

    getCountMessagesOfGroupFromDate: function(groupId, date) {
        var query = {
            groupId: groupId
        };

        if (date) {
            query.creationDate = {$gt: date};
        }

        return GroupMessage.count(query);
    },

    createMessageGroup: function (message) {
        return GroupMessage.create(message);
	}
};