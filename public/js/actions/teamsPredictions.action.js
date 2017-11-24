action.teamsPredictions = (function(){

    var teamsPredictions = {
        LOAD_TEAMS_REQUEST: "LOAD_TEAMS_REQUEST",
        LOAD_TEAMS_SUCCESS: "LOAD_TEAMS_SUCCESS",
        LOAD_TEAMS_FAILURE: "LOAD_TEAMS_FAILURE",
        loadTeams: loadTeams,

        UPDATE_TEAM_SELECTED: "UPDATE_TEAM_SELECTED",
        updateTeamSelected: updateTeamSelected
    };

    function updateTeamSelected(team) {
        return function(dispatch){
            dispatch(updateTeamsState(team));
            dispatch(action.general.setUpdating());
            service.teamsPredictions.updateTeamSelected(team).then(function(){
                dispatch(action.general.removeUpdating());
                console.log("success");
            }, function(error){
                dispatch(action.general.removeUpdating());
                console.log("error");
            });
        };

        function updateTeamsState(team) { return { type: teamsPredictions.UPDATE_TEAM_SELECTED, team: team} }
    }

    function loadTeams() {
        return function(dispatch){
            dispatch(request());
            service.teamsPredictions.getAll().then(function(teams){
                dispatch(success(teams));
            }, function(error){
                dispatch(failure(error));
            })
        };

        function request() { return { type: teamsPredictions.LOAD_TEAMS_REQUEST} }
        function success(teams) { return { type: teamsPredictions.LOAD_TEAMS_SUCCESS, teams: teams } }
        function failure(error) { return { type: teamsPredictions.LOAD_TEAMS_FAILURE, error: error} }
    }

    return teamsPredictions;
})();