reducer.gamesPredictions = (function() {

    var gamesPredictionsAction = action.gamesPredictions,
        LOAD_GAMES_REQUEST = gamesPredictionsAction.LOAD_GAMES_REQUEST,
        LOAD_GAMES_SUCCESS = gamesPredictionsAction.LOAD_GAMES_SUCCESS,
        LOAD_GAMES_FAILURE = gamesPredictionsAction.LOAD_GAMES_FAILURE,
        UPDATE_GAME = gamesPredictionsAction.UPDATE_GAME,
        UPDATE_GAME_SUCCESS = gamesPredictionsAction.UPDATE_GAME_SUCCESS,
        UPDATE_GAME_FAILURE = gamesPredictionsAction.UPDATE_GAME_FAILURE;

    var initialState = {
        matches: []
    };

    function updateGame(games, gameToUpdate) {
        var newGames = games.slice();
        var index;
        newGames.forEach(function(game, _index){
            if (game.id === gameToUpdate.id) {
                index = _index;
            }
        });

        newGames[index] = Object.assign({}, newGames[index], gameToUpdate);

        return newGames;
    }

    return function gamesPredictions(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_GAMES_REQUEST:
                return Object.assign({}, state, {isLoadingGames: true});
            case LOAD_GAMES_SUCCESS:
                return Object.assign({}, state, {matches: action.matches, isLoadingGames: false});
            case LOAD_GAMES_FAILURE:
                return Object.assign({}, state, {isLoadingGames: false});
            case UPDATE_GAME:
                return Object.assign({}, state, {matches: updateGame(state.matches, action.game)});
            /*case UPDATE_GAME_SUCCESS:
                return Object.assign({}, state, {isUpdatingGame: false});
            case UPDATE_GAME_FAILURE:
                return Object.assign({}, state, {isUpdatingGame: false});*/
            default:
                return state
        }
    }
})();