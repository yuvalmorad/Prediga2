action.leagues = (function(){

    var leagues = {
        SET_SELECTED_LEAGUE_ID: "SET_SELECTED_LEAGUE_ID",

        setSelectedLeagueId: function(leagueId) {
            return {
                type: leagues.SET_SELECTED_LEAGUE_ID,
                leagueId: leagueId
            }
        }
    };

    return leagues;
})();