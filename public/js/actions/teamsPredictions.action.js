action.teamsPredictions = (function(){

    var teamsPredictions = {
        LOAD_TEAMS_REQUEST: "LOAD_TEAMS_REQUEST",
        LOAD_TEAMS_SUCCESS: "LOAD_TEAMS_SUCCESS",
        LOAD_TEAMS_FAILURE: "LOAD_TEAMS_FAILURE",
        loadTeams: loadTeams,

        UPDATE_TEAM_SELECTED: "UPDATE_TEAM_SELECTED",
        updateTeamSelected: updateTeamSelected
    };

    function updateTeamSelected(prediction) {
        return function(dispatch){
            dispatch(action.general.setUpdating());
            service.teamsPredictions.updateTeamSelected(prediction).then(function(predictionRes){
                dispatch(updateTeamsState(predictionRes));
                dispatch(action.general.removeUpdating());
                console.log("success");
            }, function(error){
                dispatch(action.general.removeUpdating());
                console.log("error");
            });
        };

        function updateTeamsState(predictionRes) { return { type: teamsPredictions.UPDATE_TEAM_SELECTED, prediction: predictionRes} }
    }

    function loadTeams() {
        return function(dispatch){
            dispatch(request());
            service.teamsPredictions.getAll().then(function(res){
                var data = res.data;
                dispatch(success(data.teams, data.predictions, data.users));
            }, function(error){
                dispatch(failure(error));
            })
        };

        function request() { return { type: teamsPredictions.LOAD_TEAMS_REQUEST} }
        function success(teams, predictions, users) { return { type: teamsPredictions.LOAD_TEAMS_SUCCESS, teams: teams, predictions: predictions, users: users } }
        function failure(error) { return { type: teamsPredictions.LOAD_TEAMS_FAILURE, error: error} }
    }

    return teamsPredictions;
})();