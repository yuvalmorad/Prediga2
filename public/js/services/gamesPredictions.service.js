window.service = window.service || {};
service.gamesPredictions = (function() {
    return {
        getAll: getAll,
        updatePrediction: updatePrediction
    };

    function getAll(groupId) {
        return httpInstnace.get("/api/matchesUI?groupId=" + groupId);
    }

    function updatePrediction(prediction, groupId) {
        return httpInstnace.post("/api/matchPredictions?groupId=" + groupId, {matchPredictions: [prediction]}).then(function(predictions){
            return predictions && predictions.data && predictions.data[0];
        });
    }
})();