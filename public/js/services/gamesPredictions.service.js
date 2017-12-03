service.gamesPredictions = (function() {
    return {
        getAll: getAll,
        updateGame: updateGame
    };

    // get all match predictions
    function getAll() {
        return httpInstnace.get("/api/matchesUI");
    }

    // updates user predictions (array)
    function updateGame(prediction) {
        return httpInstnace.post("/api/matchPredictions", {matchPredictions: [prediction]});
    }

})();