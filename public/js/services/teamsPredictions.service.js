service.teamsPredictions = (function() {
    return {
        getAll: getAll,
        updateTeamSelected: updateTeamSelected
    };

    function getAll() {
        return httpInstnace.get("/teamsPredictions");
    }

    function updateTeamSelected(game) {
        return httpInstnace.put("/teamsPredictions/updateTeamSelected", game);
    }

})();