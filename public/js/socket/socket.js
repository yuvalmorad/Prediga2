var socket = (function(){
    var socket;

    function init() {
        if (!socket) {
            socket = io();
            registerEvents();
        }
    }

    function registerEvents() {
        socket.on('connect', function(){
            console.log("connected!!!");
        });

        socket.on('disconnect', function(){
            console.log("disconnect!!!");
        });

        socket.on('matchResultUpdate', function(data){
            var matchResult = data.matchResult;
            store.dispatch(action.gamesPredictions.updateGameResult(matchResult));
        });

        socket.on('leaderboardUpdate', function(leaders){
            store.dispatch(action.leaderBoard.updateLeaderBoard(leaders));
        });

        socket.on('newGroupMessage', function(groupMessage){
            var selectedGroupId = store.getState().groups.selectedGroupId;
            var isInGroupMessagesScreen = routerHistory.location.pathname === "/groupMessages";
            if (selectedGroupId === groupMessage.groupId) {
                //message from selected group
                if (isInGroupMessagesScreen) {
                    //the user is on the chat screen -> set message as read
                    socket.emit("groupMessageRead", {groupId: groupMessage.groupId});
                }
                store.dispatch(action.groupMessages.addMessage(groupMessage));
            }

            if (!isInGroupMessagesScreen) {
                //not in chat screen -> increment unread message
                store.dispatch(action.groupMessages.incrementUnreadMessage(groupMessage.groupId));
            }
        });
    }

    return {
        init: init
    };
})();
