action.leaderBoard = (function(){

    var leaderBoard = {
        LOAD_LEADER_BOARD_SUCCESS: "LOAD_LEADER_BOARD_SUCCESS",
        loadLeaderBoard: loadLeaderBoard
    };

    function loadLeaderBoard() {
        return function(dispatch){
            service.leaderBoard.getAll().then(function(res){
                dispatch(action.authentication.setUserId(res.headers.userid));
                dispatch(success(res.data));
            }, function(error){

            })
        };

        function success(users) { return { type: leaderBoard.LOAD_LEADER_BOARD_SUCCESS, users: users } }
    }

    return leaderBoard;
})();