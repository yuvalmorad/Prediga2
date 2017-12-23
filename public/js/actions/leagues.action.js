action.leagues = (function(){

    var leaguesAction = {
        SET_SELECTED_LEAGUE_ID: "SET_SELECTED_LEAGUE_ID",
        LOAD_LEAGUES_SUCCESS: "LOAD_LEAGUES_SUCCESS",
        LOAD_CLUBS_SUCCESS: "LOAD_CLUBS_SUCCESS",

        loadLeaguesAndClubs: function() {
            return function(dispatch){
                Promise.all([service.leagues.getAll(), service.clubs.getAll()]).then(function(res){
                    dispatch(successLeagues(res[0].data));
                    dispatch(successClubs(res[1].data));
                }, function(error){

                });
            };
            function successLeagues(leagues) { return { type: leaguesAction.LOAD_LEAGUES_SUCCESS, leagues: leagues } }
            function successClubs(clubs) { return { type: leaguesAction.LOAD_CLUBS_SUCCESS, clubs: clubs } }
        },

        setSelectedLeagueId: function(leagueId) {
            return {
                type: leaguesAction.SET_SELECTED_LEAGUE_ID,
                leagueId: leagueId
            }
        }
    };

    return leaguesAction;
})();