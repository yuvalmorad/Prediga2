action.gamesPredictions = (function(){

    var gamesPredictions = {
        LOAD_GAMES_SUCCESS: "LOAD_GAMES_SUCCESS",
        loadGames: loadGames,

        UPDATE_GAME: "UPDATE_GAME",
        updateGame: updateGame
    };

    function updateGame(prediction) {
        return utils.action.updatePrediction(prediction, service.gamesPredictions, gamesPredictions.UPDATE_GAME);
    }

    function loadGames() {
        return utils.action.loadWithPredictions(service.gamesPredictions, "matches", gamesPredictions.LOAD_GAMES_SUCCESS);
    }

    return gamesPredictions;
})();