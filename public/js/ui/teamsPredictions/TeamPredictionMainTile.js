component.TeamPredictionMainTile = (function(){
    var BaseMainTile = component.BaseMainTile;

    return  function(props) {
        var team = props.team,
            selectedTeam = props.selectedTeam,
            leagueName = models.leagues.getLeagueName(team.league),
            title = team.title;

        if (selectedTeam) {
            return re(BaseMainTile, {
                imageBackground: "url('../images/sprites/" + team.league + "_teams.png')",
                title: selectedTeam.name,
                description: leagueName,
                rankTitle: title,
                logoPosition: selectedTeam.logoPosition,
                logoClassName: team.league
            });
        } else {
            return re(BaseMainTile, {
                imageBackground: "url('../images/sprites/" +team.league + "_teams.png')",
                title: "Team",
                description: leagueName,
                rankTitle: title,
                logoPosition: models.leagues.getLeagueLogoPosition(team.league),
                logoClassName: team.league
            });
        }
    }
})();


