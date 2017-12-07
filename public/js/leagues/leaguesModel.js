models.leagues = (function(){
    var leagues = {};
    return {
        addLeague: addLeague,
        getTeamsByLeagueName: getTeamsByLeagueName,
        getLeagueLogo: getLeagueLogo,
        getLeagueName: getLeagueName
    };

    function addLeague(league, leagueName) {
        league.teams = mapTeamsByName(league.teams);
        leagues[leagueName] = league;
    }

    function getTeamsByLeagueName(leagueName) {
        return leagues[leagueName].teams;
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