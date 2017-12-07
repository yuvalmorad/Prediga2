component.TeamPredictionMainTile = (function(){
    var BaseMainTile = component.BaseMainTile;

    return  function(props) {
        var team = props.team,
            selectedTeam = props.selectedTeam,
            leagueLogo = models.leagues.getLeagueLogo(team.league),
            leagueName = models.leagues.getLeagueName(team.league);

        if (selectedTeam) {
            return re(BaseMainTile, {
                imageSrc: "../images/teamsLogo/" + selectedTeam.name + ".png",
                title: selectedTeam.name,
                description: props.fixedDescription || ""//TODO?
            });
        } else {
            return re(BaseMainTile, {
                imageSrc: "../images/teamsLogo/" + leagueLogo,
                title: "Team",
                description: leagueName
            });
        }
    }
})();


