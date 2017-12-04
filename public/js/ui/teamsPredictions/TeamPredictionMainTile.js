component.TeamPredictionMainTile = (function(){
    var BaseMainTile = component.BaseMainTile;

    return  function(props) {
        var team = props.team,
            selectedTeam = props.selectedTeam;

        if (selectedTeam) {
            return re(BaseMainTile, {
                imageSrc: "../images/teamsLogo/" + selectedTeam.name + ".png",
                title: selectedTeam.name,
                description: props.fixedDescription || ""//TODO?
            });
        } else {
            return re(BaseMainTile, {
                imageSrc: "../images/teamsLogo/" + LEAGUE.logo,
                title: "Team",
                description: LEAGUE.name
            });
        }
    }
})();


