window.action = window.action || {};
action.leaderBoard = (function(){
    var leaderBoard = {
        LOAD_LEADER_BOARD_SUCCESS: "LOAD_LEADER_BOARD_SUCCESS",
        loadLeaderBoard: loadLeaderBoard
    };

    function loadLeaderBoard() {
        return function(dispatch){
            service.leaderBoard.getAll().then(function(res){
                var leaderboard = res.data;
                dispatch(success(leaderboard));
            }, function(error){

            })
        };

        function success(leaders) { return { type: leaderBoard.LOAD_LEADER_BOARD_SUCCESS, leaders: leaders } }
    }

    return leaderBoard;
})();