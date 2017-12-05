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

        function updateGameState(predictionRes) { return { type: gamesPredictions.UPDATE_GAME, prediction: predictionRes} }
    }



    function loadGames() {
        return function(dispatch){
            dispatch(request());
            service.gamesPredictions.getAll().then(function(res){
                var userId = res.headers.userid;
                var data = res.data;
                dispatch(action.authentication.setUserId(userId));

                var userPredictions = data.predictions.filter(function(prediction){
                    return prediction.userId === userId;
                });
                var otherPredictions = data.predictions.filter(function(prediction){
                    return prediction.userId !== userId;
                });

                dispatch(success(data.matches, userPredictions, otherPredictions, data.users));
            }, function(error){
                dispatch(failure(error));
            });
        };

        function request() { return { type: gamesPredictions.LOAD_GAMES_REQUEST} }
        function success(matches, userPredictions, otherPredictions, users) { return { type: gamesPredictions.LOAD_GAMES_SUCCESS, matches: matches, userPredictions: userPredictions, otherPredictions: otherPredictions, users: users } }
        function failure(error) { return { type: gamesPredictions.LOAD_GAMES_FAILURE, error: error} }
    }

    return gamesPredictions;
})();