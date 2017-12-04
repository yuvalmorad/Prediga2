reducer.teamsPredictions = (function() {

    var teamsPredictionsAction = action.teamsPredictions,
        LOAD_TEAMS_REQUEST = teamsPredictionsAction.LOAD_TEAMS_REQUEST,
        LOAD_TEAMS_SUCCESS = teamsPredictionsAction.LOAD_TEAMS_SUCCESS,
        LOAD_TEAMS_FAILURE = teamsPredictionsAction.LOAD_TEAMS_FAILURE,
        UPDATE_TEAM_SELECTED = teamsPredictionsAction.UPDATE_TEAM_SELECTED;

    var initialState = {
        teams: [],
        predictions: [],
        users: []
    };

    return function teamsPredictions(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_TEAMS_REQUEST:
                return Object.assign({}, state, {isLoadingTeams: true});
            case LOAD_TEAMS_SUCCESS:
                return Object.assign({}, state, {teams: action.teams, predictions: action.predictions, users: action.users, isLoadingTeams: false});
            case LOAD_TEAMS_FAILURE:
                return Object.assign({}, state, {isLoadingTeams: false});
            case UPDATE_TEAM_SELECTED:
                return Object.assign({}, state, {predictions: utils.general.updateOrCreateObject(state.predictions, action.prediction)});
            default:
                return state
        }
    }
})();