window.service = window.service || {};
service.gamesPredictions = (function() {
    return {
        getAll: getAll,
        updatePrediction: updatePrediction,
        randomGamePrediction: randomGamePrediction
    };

    function getAll(groupId) {
        return httpInstnace.get("/api/matchesUI?groupId=" + groupId);
    }

    function updatePrediction(prediction, groupId) {
        return httpInstnace.post("/api/matchPredictions?groupId=" + groupId, {matchPredictions: [prediction]}).then(function(predictions){
            return predictions && predictions.data && predictions.data[0];
        });
    }

    function randomGamePrediction(groupId, matchId) {
        return httpInstnace.post("/api/matchPredictions/random?groupId=" + groupId + "&matchId=" + matchId).then(function(res){
            return res.data[0];
        });
    }
})();