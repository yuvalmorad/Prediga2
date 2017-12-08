models.leagues = (function(){
    var leagues = {};
    return {
        addLeague: addLeague,
        getLeagueLogo: getLeagueLogo,
        getLeagueName: getLeagueName,
        getTeamsByLeagueName: getTeamsByLeagueName,
        getTeamByTeamName: getTeamByTeamName
    };

    function addLeague(league) {
        league.teams = mapTeamsByName(league.teams);
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

    function getLeagueLogo(leagueName) {
        return leagues[leagueName].logo;
    }

    function getLeagueName(leagueName) {
        return leagues[leagueName].name;
    }

    function mapTeamsByName(teams) {
        var res = {};
        teams.forEach(function(team){res[team.name] = team});
        return res;
    }
})();