window.reducer = window.reducer || {};
reducer.leagues = (function() {
    var leaguesAction = action.leagues,
        SET_SELECTED_LEAGUE_ID = leaguesAction.SET_SELECTED_LEAGUE_ID,
        LOAD_LEAGUES_SUCCESS = leaguesAction.LOAD_LEAGUES_SUCCESS,
        LOAD_CLUBS_SUCCESS = leaguesAction.LOAD_CLUBS_SUCCESS;

    var initialState = {
        leagues: [],
        clubs: [],
        selectedLeagueId: ""
    };

    return function leagues(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_LEAGUES_SUCCESS:
                var leagues = action.leagues;
                return Object.assign({}, state, {leagues: leagues, selectedLeagueId: leagues.length ? leagues[1]._id: ""});//TODO [0]
            case LOAD_CLUBS_SUCCESS:
                return Object.assign({}, state, {clubs: action.clubs});
            case SET_SELECTED_LEAGUE_ID:
                return Object.assign({}, state, {selectedLeagueId: action.leagueId});
            default:
                return state
        }
    }
})();