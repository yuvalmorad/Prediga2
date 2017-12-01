component.TeamPredictionMainTile = (function(){
    var BaseMainTile = component.BaseMainTile;

    return  function(props) {
        var team = props.team,
            teamRecords = props.teamRecords,
            rank = teamRecords.rank;

        if (team) {
            var wins = teamRecords.wins || 0,
                draws = teamRecords.draws || 0,
                losts = teamRecords.losts || 0,
                points = teamRecords.points || 0;

            return re(BaseMainTile, {
                imageSrc: "../images/teamsLogo/" + team.logo,
                title: team.name,
                description: props.fixedDescription || (wins + " Wins, " + draws + " Draws, " + losts + " Losts"),
                rank: rank,
                points: points
            });
        } else {
            return re(BaseMainTile, {
                imageSrc: "../images/teamsLogo/" + LEAGUE.logo,
                title: "Team",
                description: LEAGUE.name,
                rank: rank
            });
        }

    }
})();


