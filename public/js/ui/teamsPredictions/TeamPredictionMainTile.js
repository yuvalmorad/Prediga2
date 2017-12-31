window.component = window.component || {};
component.TeamPredictionMainTile = (function(){
    var BaseMainTile = component.BaseMainTile;

    return  function(props) {
        var team = props.team,
            selectedTeam = props.selectedTeam,
            league = props.league,
            leagueName = league.name,
            leagueIdName = utils.general.leagueNameToIdName(leagueName),
            title = team.title,
            opts = {
                imageBackground: utils.general.getLeagueLogoURL(leagueIdName),
                description: leagueName,
                rankTitle: title,
                logoClassName: leagueIdName
            };

        if (selectedTeam) {
            opts.title = selectedTeam.name;
            opts.logoPosition = selectedTeam.logoPosition;
        } else {
            opts.title = "Team";
            opts.logoPosition = league.logoPosition
        }

        return re(BaseMainTile, opts);
    }
})();


