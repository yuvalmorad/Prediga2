window.action = window.action || {};
action.teamsPredictions = (function(){
    var teamsPredictions = {
        LOAD_TEAMS_SUCCESS: "LOAD_TEAMS_SUCCESS",
        loadTeams: loadTeams,

        UPDATE_TEAM_SELECTED: "UPDATE_TEAM_SELECTED",
        updateTeamSelected: updateTeamSelected
    };

    function updateTeamSelected(prediction, groupId) {
        return utils.action.updatePrediction(prediction, service.teamsPredictions, teamsPredictions.UPDATE_TEAM_SELECTED, groupId);
    }

    function loadTeams(groupId) {
        return utils.action.loadWithPredictions(service.teamsPredictions, "teams", teamsPredictions.LOAD_TEAMS_SUCCESS, groupId, "teamCategories");
    }

    return teamsPredictions;
})();