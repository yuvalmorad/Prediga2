action.gamesPredictions = (function(){

    var gamesPredictions = {
        LOAD_GAMES_SUCCESS: "LOAD_GAMES_SUCCESS",
        loadGames: loadGames,

        UPDATE_GAME: "UPDATE_GAME",
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

                dispatch(success(data.matches, userPredictions, otherPredictions, data.users, data.results));
            }, function(error){

            });
        };

        function success(matches, userPredictions, otherPredictions, users, results) { return { type: gamesPredictions.LOAD_GAMES_SUCCESS, matches: matches, userPredictions: userPredictions, otherPredictions: otherPredictions, users: users, results: results } }
    }

    return gamesPredictions;
})();