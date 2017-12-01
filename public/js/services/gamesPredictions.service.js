service.gamesPredictions = (function() {
    return {
        getAll: getAll,
        updateGame: updateGame
    };

    // get all match predictions
    function getAll() {
        return httpInstnace.get("/api/matches");
    }

    // updates all games
    function updateGame(games) {
        return httpInstnace.post("/api/matchPredictions", games);
    }

})();