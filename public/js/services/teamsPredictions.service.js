window.service = window.service || {};
service.teamsPredictions = (function() {
    return {
        getAll: getAll,
        updatePrediction: updatePrediction
    };

    function getAll(groupId) {
        return httpInstnace.get("/api/teamsUI?groupId=" + groupId);
    }

    function updatePrediction(prediction, groupId) {
        return httpInstnace.post("/api/teamPredictions?groupId=" + groupId, {teamPredictions: [prediction]}).then(function(predictions){
            return predictions && predictions.data && predictions.data[0];
        });
    }

})();