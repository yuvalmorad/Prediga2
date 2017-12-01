action.gamesPredictions = (function(){

    var gamesPredictions = {
        LOAD_GAMES_REQUEST: "LOAD_GAMES_REQUEST",
        LOAD_GAMES_SUCCESS: "LOAD_GAMES_SUCCESS",
        LOAD_GAMES_FAILURE: "LOAD_GAMES_FAILURE",
        loadGames: loadGames,

        UPDATE_GAME: "UPDATE_GAME",
        UPDATE_GAME_SUCCESS: "UPDATE_GAME_SUCCESS",
        UPDATE_GAME_FAILURE: "UPDATE_GAME_FAILURE",
        updateGame: updateGame
    };

    function updateGame(game) {
        return function(dispatch){
            dispatch(updateGameState(game));
            dispatch(action.general.setUpdating());
            service.gamesPredictions.updateGame(game).then(function(){
                //dispatch(success());
                dispatch(action.general.removeUpdating());
                console.log("success");
            }, function(error){
                //dispatch(failure(error));
                dispatch(action.general.removeUpdating());
                console.log("error");
            });
        };

        function updateGameState() { return { type: gamesPredictions.UPDATE_GAME, game: game} }
        //function success() { return { type: gamesPredictions.UPDATE_GAME_SUCCESS} }
        //function failure(error) { return { type: gamesPredictions.UPDATE_GAME_FAILURE, error: error} }
    }

    function loadGames() {
        return function(dispatch){
            dispatch(request());
            service.gamesPredictions.getAll().then(function(res){
                dispatch(success(res.data));
            }, function(error){
                dispatch(failure(error));
            });
        };

        function request() { return { type: gamesPredictions.LOAD_GAMES_REQUEST} }
        function success(matches) { return { type: gamesPredictions.LOAD_GAMES_SUCCESS, matches: matches } }
        function failure(error) { return { type: gamesPredictions.LOAD_GAMES_FAILURE, error: error} }
    }

    return gamesPredictions;
})();