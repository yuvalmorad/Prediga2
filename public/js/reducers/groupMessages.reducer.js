window.reducer = window.reducer || {};
reducer.groupMessages = function() {
    var groupMessagesAction = action.groupMessages,
        LOAD_GROUP_MESSAGES_SUCCESS = groupMessagesAction.LOAD_GROUP_MESSAGES_SUCCESS,
        ADD_MESSAGE_SUCCESS = groupMessagesAction.ADD_MESSAGE_SUCCESS,
        LOAD_UNREAD_MESSAGES_SUCCESS = groupMessagesAction.LOAD_UNREAD_MESSAGES_SUCCESS,
        INCREMENT_UNREAD_MESSAGE = groupMessagesAction.INCREMENT_UNREAD_MESSAGE,
        RESET_UNREAD_MESSAGE = groupMessagesAction.RESET_UNREAD_MESSAGE;

    var initialState = {
        groupMessages: [],
        unreadMessagesByGroup: []
    };

    function updateUnreadMessage(unreadMessagesByGroup, groupId, isIncrement) { //increment or reset
        unreadMessagesByGroup = unreadMessagesByGroup.slice();
        var group = utils.general.findItemInArrBy(unreadMessagesByGroup, "groupId", groupId);
        if (group) {
            if (isIncrement) {
                group.count += 1;
            } else {
                //is reset
                group.count = 0;
            }
        } else {
            unreadMessagesByGroup.push({
                groupId: groupId,
                count: isIncrement ? 1 : 0
            })
        }

        return unreadMessagesByGroup;
    }

    return function teamsPredictions(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_GROUP_MESSAGES_SUCCESS:
                return Object.assign({}, state, {groupMessages: action.groupMessages});
            case LOAD_UNREAD_MESSAGES_SUCCESS:
                return Object.assign({}, state, {unreadMessagesByGroup: action.unreadMessagesByGroup});
            case INCREMENT_UNREAD_MESSAGE:
                return Object.assign({}, state, {unreadMessagesByGroup: updateUnreadMessage(state.unreadMessagesByGroup, action.groupId, true)});
            case RESET_UNREAD_MESSAGE:
                return Object.assign({}, state, {unreadMessagesByGroup: updateUnreadMessage(state.unreadMessagesByGroup, action.groupId, false)});
            case ADD_MESSAGE_SUCCESS:
                var groupMessages = utils.general.copyArrAndAdd(state.groupMessages, action.groupMessage);
                return Object.assign({}, state, {groupMessages: groupMessages});
            default:
                return state
        }
    }
}