service.teamsPredictions = (function() {
    return {
        getAll: getAll,
        updateTeamSelected: updateTeamSelected
    };

    function getAll() {
        return httpInstnace.get("/api/teamsUI");
    }

    function updateTeamSelected(prediction) {
        return httpInstnace.post("/api/teamPredictions", {teamPredictions: [prediction]}).then(function(predictions){
            return predictions && predictions.data && predictions.data[0];
        });
    }

})();