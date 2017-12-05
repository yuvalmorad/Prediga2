reducer.teamsPredictions = (function() {

    var teamsPredictionsAction = action.teamsPredictions,
        LOAD_TEAMS_SUCCESS = teamsPredictionsAction.LOAD_TEAMS_SUCCESS,
        UPDATE_TEAM_SELECTED = teamsPredictionsAction.UPDATE_TEAM_SELECTED;

    var initialState = {
        teams: [],
        predictions: [],
        users: [],
        results: []
    };

    return function teamsPredictions(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_TEAMS_SUCCESS:
                return Object.assign({}, state, {teams: action.teams, predictions: action.predictions, users: action.users, results: action.results});
            case UPDATE_TEAM_SELECTED:
                return Object.assign({}, state, {predictions: utils.general.updateOrCreateObject(state.predictions, action.prediction)});
            default:
                return state
        }
    }
})();