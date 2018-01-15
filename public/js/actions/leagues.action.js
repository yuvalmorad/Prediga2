window.action = window.action || {};
action.leagues = (function(){
    var leaguesAction = {
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
        }
    };

    return leaguesAction;
})();