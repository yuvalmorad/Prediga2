window.reducer = window.reducer || {};
reducer.leaderBoard = (function() {

    var leaderBoardAction = action.leaderBoard,
        LOAD_LEADER_BOARD_SUCCESS = leaderBoardAction.LOAD_LEADER_BOARD_SUCCESS;

    var initialState = {
        leaders: [],
        status: utils.action.REQUEST_STATUS.NOT_LOADED
    };

    return function leaderBoard(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_LEADER_BOARD_SUCCESS:
                return Object.assign({}, state, {leaders: action.leaders, status: utils.action.REQUEST_STATUS.SUCCESS_LOADED});
            default:
                return state
        }
    }
})();