reducer.gamesPredictions = (function() {

    var gamesPredictionsAction = action.gamesPredictions,
        LOAD_GAMES_SUCCESS = gamesPredictionsAction.LOAD_GAMES_SUCCESS,
        UPDATE_GAME = gamesPredictionsAction.UPDATE_GAME;

    var initialState = {
        matches: [],
        userPredictions: [],
        otherPredictions: [],
        users: [],
        results: []
    };

    return function gamesPredictions(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_GAMES_SUCCESS:
                return Object.assign({}, state, {matches: action.matches, userPredictions: action.userPredictions, otherPredictions: action.otherPredictions, users: action.users, results: action.results});
            case UPDATE_GAME:
                return Object.assign({}, state, {userPredictions: utils.general.updateOrCreateObject(state.userPredictions, action.prediction)});
            default:
                return state
        }
    }
})();