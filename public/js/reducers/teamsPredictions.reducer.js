reducer.teamsPredictions = (function() {

    var teamsPredictionsAction = action.teamsPredictions,
        LOAD_TEAMS_REQUEST = teamsPredictionsAction.LOAD_TEAMS_REQUEST,
        LOAD_TEAMS_SUCCESS = teamsPredictionsAction.LOAD_TEAMS_SUCCESS,
        LOAD_TEAMS_FAILURE = teamsPredictionsAction.LOAD_TEAMS_FAILURE,
        UPDATE_TEAM_SELECTED = teamsPredictionsAction.UPDATE_TEAM_SELECTED;

    var initialState = {
        teams: []
    };

    function updateTeamSelected(teams, teamToUpdate) {
        var newTeams = teams.slice();
        var index;
        newTeams.forEach(function(team, _index){
            if (team.rank === teamToUpdate.rank) {
                index = _index;
            }
        });

        if (index === undefined) {
            //no team with such rank -> create new one
            newTeams.push(Object.assign({}, teamToUpdate)); //TODO remove
        } else {
            //update selected team
            newTeams[index] = Object.assign({}, teamToUpdate);
        }

        return newTeams;
    }

    return function teamsPredictions(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_TEAMS_REQUEST:
                return Object.assign({}, state, {isLoadingTeams: true});
            case LOAD_TEAMS_SUCCESS:
                return Object.assign({}, state, {teams: action.teams, isLoadingTeams: false});
            case LOAD_TEAMS_FAILURE:
                return Object.assign({}, state, {isLoadingTeams: false});
            case UPDATE_TEAM_SELECTED:
                return Object.assign({}, state, {teams: updateTeamSelected(state.teams, action.team)});
            default:
                return state
        }
    }
})();