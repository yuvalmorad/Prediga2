component.TeamPredictionFormTile = (function(){
    var ImagesPagination = component.ImagesPagination;

    return function(props) {
        var teams = LEAGUE.teams,
            teamSelected = props.team,
            teamSelectedId = teamSelected ? teamSelected.id : null,
            items = Object.keys(teams).map(function(teamId){
                var team = teams[teamId];
                var isSelected = false;
                if (teamSelectedId && teamSelectedId === teamId) {
                    isSelected = true;
                }

                return {
                    isSelected: isSelected,
                    logo: team.logo,
                    logoGray: team.logoGray,
                    name: team.name,
                    shortName: team.shortName,
                    id: team.id
                }
            });

        return re("div", {className: "team-prediction-form"},
            re(ImagesPagination, {items: items, onSelectedTeamChanged: props.onSelectedTeamChanged})
        );
    };
})();


