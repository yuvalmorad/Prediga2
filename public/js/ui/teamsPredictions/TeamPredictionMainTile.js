component.TeamPredictionMainTile = (function(){
    var BaseMainTile = component.BaseMainTile;

    return  function(props) {
        var team = props.team,
            selectedTeam = props.selectedTeam,
            leagueName = models.leagues.getLeagueName(team.league),
            title = team.title,
            opts = {
                imageBackground: utils.general.getLeagueLogoURL(team.league),
                description: leagueName,
                rankTitle: title,
                logoClassName: team.league
            };

        if (selectedTeam) {
            opts.title = selectedTeam.name;
            opts.logoPosition = selectedTeam.logoPosition;
        } else {
            opts.title = "Team";
            opts.logoPosition = models.leagues.getLeagueLogoPosition(team.league);
        }

        return re(BaseMainTile, opts);
    }
})();


