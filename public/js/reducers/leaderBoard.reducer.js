reducer.leaderBoard = (function() {

    var leaderBoardAction = action.leaderBoard,
        LOAD_LEADER_BOARD_REQUEST = leaderBoardAction.LOAD_LEADER_BOARD_REQUEST,
        LOAD_LEADER_BOARD_SUCCESS = leaderBoardAction.LOAD_LEADER_BOARD_SUCCESS,
        LOAD_LEADER_BOARD_FAILURE = leaderBoardAction.LOAD_LEADER_BOARD_FAILURE;

    var initialState = {
        users: []
    };

    return function leaderBoard(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_LEADER_BOARD_REQUEST:
                return Object.assign({}, state, {isLoadingLeaderBoard: true});
            case LOAD_LEADER_BOARD_SUCCESS:
                return Object.assign({}, state, {users: action.users, isLoadingLeaderBoard: false});
            case LOAD_LEADER_BOARD_FAILURE:
                return Object.assign({}, state, {isLoadingLeaderBoard: false});
            default:
                return state
        }
    }
})();