window.reducer = window.reducer || {};
reducer.gamesPredictions = (function() {
    var gamesPredictionsAction = action.gamesPredictions,
        LOAD_GAMES_SUCCESS = gamesPredictionsAction.LOAD_GAMES_SUCCESS,
        UPDATE_GAME = gamesPredictionsAction.UPDATE_GAME,
        UPDATE_GAME_RESULT = gamesPredictionsAction.UPDATE_GAME_RESULT;

    var initialState = {
        matches: [],
        userPredictions: [],
        results: [],
        predictionsCounters: {},
        status: utils.action.REQUEST_STATUS.NOT_LOADED
    };

    return function gamesPredictions(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_GAMES_SUCCESS:
                return Object.assign({}, state, {matches: action.matches, userPredictions: action.userPredictions, results: action.results, predictionsCounters: action.predictionsCounters, status: utils.action.REQUEST_STATUS.SUCCESS_LOADED});
            case UPDATE_GAME:
                return Object.assign({}, state, {userPredictions: utils.general.updateOrCreateObject(state.userPredictions, action.prediction)});
            case UPDATE_GAME_RESULT:
                return Object.assign({}, state, {results:  utils.general.updateOrCreateObject(state.results, action.result, "matchId")});
            default:
                return state
        }
    }
})();