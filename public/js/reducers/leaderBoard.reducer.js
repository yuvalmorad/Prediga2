window.reducer = window.reducer || {};
reducer.leaderBoard = function() {

    var leaderBoardAction = action.leaderBoard,
        LOAD_LEADER_BOARD_SUCCESS = leaderBoardAction.LOAD_LEADER_BOARD_SUCCESS,
        UPDATE_LEADER_BOARD = leaderBoardAction.UPDATE_LEADER_BOARD,
		TOGGLE_FAVOURITE_USER = leaderBoardAction.TOGGLE_FAVOURITE_USER;

    var initialState = {
        leaders: [],
        status: utils.action.REQUEST_STATUS.NOT_LOADED,
        favouriteUsersIds: utils.localStorage.getFavouriteUsersIds()
    };

    return function leaderBoard(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_LEADER_BOARD_SUCCESS:
                return Object.assign({}, state, {leaders: action.leaders, status: utils.action.REQUEST_STATUS.SUCCESS_LOADED});
            case UPDATE_LEADER_BOARD:
                return Object.assign({}, state, {leaders: action.leaders});
            case TOGGLE_FAVOURITE_USER:
				var userId = action.userId;
				var favouriteUsersIds = state.favouriteUsersIds.slice();
				var foundIndex = favouriteUsersIds.indexOf(userId);
				if (foundIndex >= 0) {
					favouriteUsersIds.splice(foundIndex, 1);
                } else {
					favouriteUsersIds.push(userId);
                }

				utils.localStorage.setFavouriteUsersIds(favouriteUsersIds);

                return Object.assign({}, state, {favouriteUsersIds: favouriteUsersIds});
            default:
                return state
        }
    }
};