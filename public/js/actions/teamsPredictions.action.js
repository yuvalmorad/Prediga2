action.teamsPredictions = (function(){

    var teamsPredictions = {
        LOAD_TEAMS_SUCCESS: "LOAD_TEAMS_SUCCESS",
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
            service.teamsPredictions.getAll().then(function(res){
                dispatch(action.authentication.setUserId(res.headers.userid));
                var data = res.data;
                dispatch(success(data.teams, data.predictions, data.users, data.results));
            }, function(error){

            })
        };

        function success(teams, predictions, users, results) { return { type: teamsPredictions.LOAD_TEAMS_SUCCESS, teams: teams, predictions: predictions, users: users, results: results } }
    }

    return teamsPredictions;
})();