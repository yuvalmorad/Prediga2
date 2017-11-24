service.gamesPredictions = (function() {
    return {
        getAll: getAll,
        updateGame: updateGame
    };

    function getAll() {
        return httpInstnace.get("/gamesPredictions");
    }

    function updateGame(game) {
        return httpInstnace.put("/gamesPredictions/updateGame", game);
    }

})();