reducer.gamesPredictions = (function() {

    var gamesPredictionsAction = action.gamesPredictions,
        LOAD_GAMES_REQUEST = gamesPredictionsAction.LOAD_GAMES_REQUEST,
        LOAD_GAMES_SUCCESS = gamesPredictionsAction.LOAD_GAMES_SUCCESS,
        LOAD_GAMES_FAILURE = gamesPredictionsAction.LOAD_GAMES_FAILURE,
        UPDATE_GAME = gamesPredictionsAction.UPDATE_GAME

    var initialState = {
        matches: [],
        userPredictions: [],
        otherPredictions: [],
        users: []
    };

    return function gamesPredictions(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_GAMES_REQUEST:
                return Object.assign({}, state, {isLoadingGames: true});
            case LOAD_GAMES_SUCCESS:
                return Object.assign({}, state, {matches: action.matches, userPredictions: action.userPredictions, otherPredictions: action.otherPredictions, users: action.users, isLoadingGames: false});
            case LOAD_GAMES_FAILURE:
                return Object.assign({}, state, {isLoadingGames: false});
            case UPDATE_GAME:
                return Object.assign({}, state, {userPredictions: utils.general.updateOrCreateObject(state.userPredictions, action.prediction)});
            default:
                return state
        }
    }
})();