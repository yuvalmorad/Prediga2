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
            store.dispatch(action.groupMessages.addMessage(groupMessage));
        });
    }

    return {
        init: init
    };
})();
