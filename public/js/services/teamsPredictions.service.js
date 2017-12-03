service.teamsPredictions = (function() {
    return {
        getAll: getAll,
        updateTeamSelected: updateTeamSelected
    };

    function getAll() {
        return httpInstnace.get("/api/teamsUI");
    }

    function updateTeamSelected(teams) {
        return httpInstnace.post("/api/teamPredictions", teams);
    }

})();