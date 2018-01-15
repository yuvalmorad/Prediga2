window.reducer = window.reducer || {};
reducer.leagues = function() {
    var leaguesAction = action.leagues,
        LOAD_LEAGUES_SUCCESS = leaguesAction.LOAD_LEAGUES_SUCCESS,
        LOAD_CLUBS_SUCCESS = leaguesAction.LOAD_CLUBS_SUCCESS;

    var initialState = {
        leagues: [],
        clubs: []
    };

    return function leagues(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_LEAGUES_SUCCESS:
                var leagues = action.leagues;
                return Object.assign({}, state, {leagues: leagues});
            case LOAD_CLUBS_SUCCESS:
                return Object.assign({}, state, {clubs: action.clubs});
            default:
                return state
        }
    }
}