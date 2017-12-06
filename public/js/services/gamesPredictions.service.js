service.gamesPredictions = (function() {
    return {
        getAll: getAll,
        updatePrediction: updatePrediction
    };

    function getAll() {
        return httpInstnace.get("/api/matchesUI");
    }

    function updatePrediction(prediction) {
        return httpInstnace.post("/api/matchPredictions", {matchPredictions: [prediction]}).then(function(predictions){
            return predictions && predictions.data && predictions.data[0];
        });
    }
})();