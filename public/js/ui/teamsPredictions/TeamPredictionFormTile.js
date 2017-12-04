component.TeamPredictionFormTile = (function(){
    var ImagesPagination = component.ImagesPagination;

    return function(props) {
        var teamsOptions,
            selectedTeam = props.selectedTeam,
            team = props.team;

        if (team.options.length) {
            teamsOptions = team.options.map(function(teamOptionName){
               return LEAGUE.teams[teamOptionName];
            });
        } else {
            teamsOptions = Object.keys(LEAGUE.teams).map(function(teamName){
                return LEAGUE.teams[teamName];
            });
        }

        var items = teamsOptions.map(function(teamOption){
                var isSelected = false;
                var teamName = teamOption.name;
                if (selectedTeam && selectedTeam.name === teamName) {
                    isSelected = true;
                }

                return {
                    isSelected: isSelected,
                    name: teamName,
                    shortName: teamOption.shortName
                }
            });

        return re("div", {className: "team-prediction-form"},
            re(ImagesPagination, {items: items, onSelectedTeamChanged: props.onSelectedTeamChanged})
        );
    };
})();


