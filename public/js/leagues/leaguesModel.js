/*
models.leagues = (function(){
    var leagues = {};
    return {
        addLeague: addLeague,
        getLeagueLogoPosition: getLeagueLogoPosition,
        getLeagueName: getLeagueName,
        getTeamsByLeagueName: getTeamsByLeagueName,
        getTeamByTeamName: getTeamByTeamName,
        getAllLeagues: getAllLeagues
    };

    function getAllLeagues() {
        return Object.keys(leagues).map(function(leagueId){
            var league = leagues[leagueId];
            return {
                id: league.id,
                name: league.name
            }
        })
    }

    function addLeague(league) {
        league.teams = mapTeamsByName(league.teams, league.id);
        leagues[league.id] = league;
    }

    function getTeamsByLeagueName(leagueName) {
        return leagues[leagueName].teams;
    }

    function getTeamByTeamName(teamName) {
        var leageName;
        for (leageName in leagues) {
            var team = leagues[leageName].teams[teamName];
            if (team) {
                return team;
            }
        }
    }

    function getLeagueLogoPosition(leagueName) {
        return leagues[leagueName].logoPosition;
    }

    function getLeagueName(leagueName) {
        return leagues[leagueName].name;
    }

    function mapTeamsByName(teams, leagueId) {
        var res = {};
        teams.forEach(function(team){
            team.leagueId = leagueId;
            res[team.name] = team}
        );
        return res;
    }
})();*/
