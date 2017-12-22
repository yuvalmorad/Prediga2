reducer.leagues = (function() {
    var SET_SELECTED_LEAGUE_ID = action.leagues.SET_SELECTED_LEAGUE_ID;

    var leagues = models.leagues.getAllLeagues();
    var selectedLeagueId = leagues[0].id;

    var initialState = {
        leagues: leagues,
        selectedLeagueId: selectedLeagueId
    };

    return function leagues(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case SET_SELECTED_LEAGUE_ID:
                return Object.assign({}, state, {selectedLeagueId: action.leagueId});
            default:
                return state
        }
    }
})();