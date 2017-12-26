component.TeamPredictionFormTile = (function(){
    var ImagesPagination = component.ImagesPagination;

    return function(props) {
        var teamsOptions,
            selectedTeam = props.selectedTeam,
            team = props.team,
            clubs = props.clubs,
            league = props.league;

        var clubsIds = league.clubs;
        clubs = clubs.filter(function(club){
            return clubsIds.indexOf(club._id) >= 0;
        });

        if (team.options.length) {
            teamsOptions = team.options.map(function(teamOptionId){
               return utils.general.findItemInArrBy(clubs, "_id", teamOptionId);
            });
        } else {
            teamsOptions = clubs
        }

        var items = teamsOptions.sort(function(team1, team2){
                return team1.name.localeCompare(team2.name);
            }).map(function(teamOption){
                var isSelected = false;
                var teamId = teamOption._id;
                if (selectedTeam && selectedTeam._id === teamId) {
                    isSelected = true;
                }

                return {
                    isSelected: isSelected,
                    id: teamOption._id,
                    shortName: teamOption.shortName,
                    logoPosition: teamOption.logoPosition,
                    leagueIdName: utils.general.leagueNameToIdName(league.name)
                }
            });

        return re("div", {className: "team-prediction-form"},
            re(ImagesPagination, {items: items, onSelectedTeamChanged: props.onSelectedTeamChanged})
        );
    };
})();


