const GroupMessageRead = require('../models/groupMessageRead');
const utils = require('../utils/util');

const self = module.exports = {
    setLastReadMessage: function (userId, groupId) {
        return GroupMessageRead.findOneAndUpdate({userId: userId, groupId: groupId}, {
            userId: userId,
            groupId: groupId,
            lastReadDate: Date.now()
        }, utils.updateSettings);
	},

    getgetUnReadMessagesOfUserInAllGroups: function(userId) {
        return GroupMessageRead.find({userId: userId});
    }
};