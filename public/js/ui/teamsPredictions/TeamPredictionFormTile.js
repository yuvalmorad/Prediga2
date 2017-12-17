component.TeamPredictionFormTile = (function(){
    var ImagesPagination = component.ImagesPagination;

    return function(props) {
        var teamsOptions,
            selectedTeam = props.selectedTeam,
            team = props.team,
            teams = models.leagues.getTeamsByLeagueName(team.league);

        if (team.options.length) {
            teamsOptions = team.options.map(function(teamOptionName){
               return teams[teamOptionName];
            });
        } else {
            teamsOptions = Object.keys(teams).map(function(teamName){
                return teams[teamName];
            });
        }

        var items = teamsOptions.sort(function(team1, team2){
                return team1.name.localeCompare(team2.name);
            }).map(function(teamOption){
                var isSelected = false;
                var teamName = teamOption.name;
                var team = models.leagues.getTeamByTeamName(teamName);
                if (selectedTeam && selectedTeam.name === teamName) {
                    isSelected = true;
                }

                return {
                    isSelected: isSelected,
                    name: teamName,
                    shortName: teamOption.shortName,
                    logoPosition: team.logoPosition,
                    leagueId: team.leagueId
                }
            });

        return re("div", {className: "team-prediction-form"},
            re(ImagesPagination, {items: items, onSelectedTeamChanged: props.onSelectedTeamChanged})
        );
    };
})();


