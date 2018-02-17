window.action = window.action || {};
action.gamesPredictions = (function(){
    var gamesPredictions = {
        LOAD_GAMES_SUCCESS: "LOAD_GAMES_SUCCESS",
        loadGames: loadGames,

        UPDATE_GAME: "UPDATE_GAME",
        updateGame: updateGame,

        UPDATE_GAME_RESULT: "UPDATE_GAME_RESULT",
        updateGameResult: updateGameResult,

        randomGamePrediction: randomGamePrediction
    };

    function randomGamePrediction(groupId, matchId) {
        return function(dispatch){
            service.gamesPredictions.randomGamePrediction(groupId, matchId).then(function(predictionRes){
                dispatch({type: gamesPredictions.UPDATE_GAME, prediction: predictionRes});
            });
        }
    }

    function updateGame(prediction, groupId) {
        return utils.action.updatePrediction(prediction, service.gamesPredictions, gamesPredictions.UPDATE_GAME, groupId);
    }

    function loadGames(groupId) {
        return utils.action.loadWithPredictions(service.gamesPredictions, "matches", gamesPredictions.LOAD_GAMES_SUCCESS, groupId);
    }

    function updateGameResult(result) {
        return {
            type: gamesPredictions.UPDATE_GAME_RESULT,
            result: result
        }
    }

    return gamesPredictions;
})();