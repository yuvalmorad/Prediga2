window.service = window.service || {};
service.teamsPredictions = (function() {
    return {
        getAll: getAll,
        updatePrediction: updatePrediction
    };

    function getAll(groupId) {
        return httpInstnace.get("/api/teamsUI");
    }

    function updatePrediction(prediction) {
        return httpInstnace.post("/api/teamPredictions", {teamPredictions: [prediction]}).then(function(predictions){
            return predictions && predictions.data && predictions.data[0];
        });
    }

})();