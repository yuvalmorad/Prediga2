window.action = window.action || {};
action.gamesPredictions = (function(){
    var gamesPredictions = {
        LOAD_GAMES_SUCCESS: "LOAD_GAMES_SUCCESS",
        loadGames: loadGames,

        UPDATE_GAME: "UPDATE_GAME",
        updateGame: updateGame,

        UPDATE_GAME_RESULT: "UPDATE_GAME_RESULT",
        updateGameResult: updateGameResult
    };

    function updateGame(prediction) {
        return utils.action.updatePrediction(prediction, service.gamesPredictions, gamesPredictions.UPDATE_GAME);
    }

    function loadGames() {
        return utils.action.loadWithPredictions(service.gamesPredictions, "matches", gamesPredictions.LOAD_GAMES_SUCCESS);
    }

    function updateGameResult(result) {
        return {
            type: gamesPredictions.UPDATE_GAME_RESULT,
            result: result
        }
    }

    return gamesPredictions;
})();