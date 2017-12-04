service.gamesPredictions = (function() {
    return {
        getAll: getAll,
        updateGame: updateGame
    };

    function getAll() {
        return httpInstnace.get("/api/matchesUI");
    }

    function updateGame(prediction) {
        return httpInstnace.post("/api/matchPredictions", {matchPredictions: [prediction]}).then(function(predictions){
            return predictions && predictions.data && predictions.data[0];
        });
    }
})();