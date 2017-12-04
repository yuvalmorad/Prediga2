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

    function updateGame(prediction) {
        return function(dispatch){
            dispatch(action.general.setUpdating());
            service.gamesPredictions.updateGame(prediction).then(function(predictionRes){
                dispatch(updateGameState(predictionRes));
                dispatch(action.general.removeUpdating());
                console.log("success");
            }, function(error){
                dispatch(action.general.removeUpdating());
                console.log("error");
            });
        };

        function updateGameState() { return { type: gamesPredictions.UPDATE_GAME, prediction: prediction} }
        //function success() { return { type: gamesPredictions.UPDATE_GAME_SUCCESS} }
        //function failure(error) { return { type: gamesPredictions.UPDATE_GAME_FAILURE, error: error} }
    }

    function loadGames() {
        return function(dispatch){
            dispatch(request());
            service.gamesPredictions.getAll().then(function(res){
                var data = res.data;
                dispatch(success(data.matches, data.predictions, data.users));
            }, function(error){
                dispatch(failure(error));
            });
        };

        function request() { return { type: gamesPredictions.LOAD_GAMES_REQUEST} }
        function success(matches, predictions, users) { return { type: gamesPredictions.LOAD_GAMES_SUCCESS, matches: matches, predictions: predictions, users: users } }
        function failure(error) { return { type: gamesPredictions.LOAD_GAMES_FAILURE, error: error} }
    }

    return gamesPredictions;
})();