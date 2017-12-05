action.leaderBoard = (function(){

    var leaderBoard = {
        LOAD_LEADER_BOARD_SUCCESS: "LOAD_LEADER_BOARD_SUCCESS",
        loadLeaderBoard: loadLeaderBoard
    };

    function loadLeaderBoard() {
        return function(dispatch){
            service.leaderBoard.getAll().then(function(res){
                var data = res.data;
                dispatch(action.authentication.setUserId(res.headers.userid));
                dispatch(success(data.leaderboard, data.users));
            }, function(error){

            })
        };

        function success(leaders, users) { return { type: leaderBoard.LOAD_LEADER_BOARD_SUCCESS, leaders: leaders, users: users } }
    }

    return leaderBoard;
})();