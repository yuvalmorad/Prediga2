window.action = window.action || {};
action.leaderBoard = (function(){
    var leaderBoard = {
        LOAD_LEADER_BOARD_SUCCESS: "LOAD_LEADER_BOARD_SUCCESS",
        loadLeaderBoard: loadLeaderBoard,

        UPDATE_LEADER_BOARD: "UPDATE_LEADER_BOARD",
        updateLeaderBoard: updateLeaderBoard,

        TOGGLE_FAVOURITE_USER: "TOGGLE_FAVOURITE_USER",
		toggleFavouriteUser: toggleFavouriteUser
    };

    function loadLeaderBoard(groupId) {
        return function(dispatch){
            service.leaderBoard.getAll(groupId).then(function(res){
                var leaderboard = res.data;
                dispatch(success(leaderboard));
            }, function(error){

            })
        };

        function success(leaders) { return { type: leaderBoard.LOAD_LEADER_BOARD_SUCCESS, leaders: leaders } }
    }

    function updateLeaderBoard(leaders) {
        return {
            type: leaderBoard.UPDATE_LEADER_BOARD,
            leaders: leaders
        };
    }

    function toggleFavouriteUser(userId) {
		return {
			type: leaderBoard.TOGGLE_FAVOURITE_USER,
			userId: userId
		}
    }

    return leaderBoard;
})();