reducer.leaderBoard = (function() {

    var leaderBoardAction = action.leaderBoard,
        LOAD_LEADER_BOARD_SUCCESS = leaderBoardAction.LOAD_LEADER_BOARD_SUCCESS;

    var initialState = {
        users: []
    };

    return function leaderBoard(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_LEADER_BOARD_SUCCESS:
                return Object.assign({}, state, {users: action.users, isLoadingLeaderBoard: false});
            default:
                return state
        }
    }
})();