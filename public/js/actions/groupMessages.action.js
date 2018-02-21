window.action = window.action || {};
action.groupMessages = (function(){
    var groupMessagesAction = {
        LOAD_GROUP_MESSAGES_SUCCESS: "LOAD_GROUP_MESSAGES_SUCCESS",
        loadGroupMessages: loadGroupMessages,

        ADD_MESSAGE_SUCCESS: "ADD_MESSAGE_SUCCESS",
        addMessage: addMessage,

        sendMessage: sendMessage
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

    return groupMessagesAction;
})();