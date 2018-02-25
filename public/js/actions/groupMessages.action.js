window.action = window.action || {};
action.groupMessages = (function(){
    var groupMessagesAction = {
        LOAD_GROUP_MESSAGES_SUCCESS: "LOAD_GROUP_MESSAGES_SUCCESS",
        loadGroupMessages: loadGroupMessages,

        ADD_MESSAGE_SUCCESS: "ADD_MESSAGE_SUCCESS",
        addMessage: addMessage,

        sendMessage: sendMessage,

        LOAD_UNREAD_MESSAGES_SUCCESS: "LOAD_UNREAD_MESSAGES_SUCCESS",
        getUnReadMessages: getUnReadMessages,

        INCREMENT_UNREAD_MESSAGE: "INCREMENT_UNREAD_MESSAGE",
        incrementUnreadMessage: incrementUnreadMessage,

        RESET_UNREAD_MESSAGE: "RESET_UNREAD_MESSAGE",
        resetUnreadMessage: resetUnreadMessage
    };

    function loadGroupMessages(groupId) {
        return function(dispatch){
            service.groupMessages.getAllByGroupId(groupId).then(function(groupMessages){
                dispatch({type: groupMessagesAction.LOAD_GROUP_MESSAGES_SUCCESS, groupMessages: groupMessages});
            }, function(error){

            })
        };
    }

    function sendMessage(message, groupId) {
        return function(dispatch){
            service.groupMessages.createMessage(message, groupId).then(function(groupMessage){
                dispatch(addMessage(groupMessage));
            }, function(error){

            })
        };
    }

    function addMessage(groupMessage) {
        return {
            type: groupMessagesAction.ADD_MESSAGE_SUCCESS,
            groupMessage: groupMessage
        }
    }

    function getUnReadMessages() {
        return function(dispatch){
            service.groupMessages.getUnReadMessages().then(function(unreadMessagesByGroup){
                dispatch({type: groupMessagesAction.LOAD_UNREAD_MESSAGES_SUCCESS, unreadMessagesByGroup: unreadMessagesByGroup});
            }, function(error){

            })
        };
    }

    function incrementUnreadMessage(groupId) {
        return {
            type: groupMessagesAction.INCREMENT_UNREAD_MESSAGE,
            groupId: groupId
        }
    }

    function resetUnreadMessage(groupId) {
        return {
            type: groupMessagesAction.RESET_UNREAD_MESSAGE,
            groupId: groupId
        }
    }

    return groupMessagesAction;
})();