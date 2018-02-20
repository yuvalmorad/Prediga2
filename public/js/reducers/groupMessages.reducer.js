window.reducer = window.reducer || {};
reducer.groupMessages = function() {
    var groupMessagesAction = action.groupMessages,
        LOAD_GROUP_MESSAGES_SUCCESS = groupMessagesAction.LOAD_GROUP_MESSAGES_SUCCESS,
        ADD_MESSAGE_SUCCESS = groupMessagesAction.ADD_MESSAGE_SUCCESS;

    var initialState = {
        groupMessages: []
    };

    return function teamsPredictions(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_GROUP_MESSAGES_SUCCESS:
                return Object.assign({}, state, {groupMessages: action.groupMessages});
            case ADD_MESSAGE_SUCCESS:
                var groupMessages = utils.general.copyArrAndAdd(state.groupMessages, action.groupMessage);
                return Object.assign({}, state, {groupMessages: groupMessages});
            default:
                return state
        }
    }
}