action.leaderBoard = (function(){

    var leaderBoard = {
        LOAD_LEADER_BOARD_REQUEST: "LOAD_LEADER_BOARD_REQUEST",
        LOAD_LEADER_BOARD_SUCCESS: "LOAD_LEADER_BOARD_SUCCESS",
        LOAD_LEADER_BOARD_FAILURE: "LOAD_LEADER_BOARD_FAILURE",
        loadLeaderBoard: loadLeaderBoard
    };

    function loadLeaderBoard() {
        return function(dispatch){
            dispatch(request());
            service.leaderBoard.getAll().then(function(res){
                dispatch(action.authentication.setUserId(res.headers.userid));
                dispatch(success(res.data));
            }, function(error){
                dispatch(failure(error));
            })
        };

        function request() { return { type: leaderBoard.LOAD_LEADER_BOARD_REQUEST} }
        function success(users) { return { type: leaderBoard.LOAD_LEADER_BOARD_SUCCESS, users: users } }
        function failure(error) { return { type: leaderBoard.LOAD_LEADER_BOARD_FAILURE, error: error} }
    }

    return leaderBoard;
})();