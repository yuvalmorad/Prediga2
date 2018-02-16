window.component = window.component || {};
component.TeamPredictionFormTile = (function(){
    var ImagesPagination = component.ImagesPagination,
        Search = component.Search;

    return React.createClass({
        getInitialState: function() {
            return {
                teamOptions: this.getTeamOptions()
            }
        },

        onSearch: function(str) {
            var teamSerached = this.state.teamOptions.filter(function(team){
                return team.name.toLowerCase().indexOf(str.toLowerCase()) >= 0;
            })[0];

            if (teamSerached) {
                this.props.onSelectedTeamChanged(teamSerached._id);
            }
        },

        getTeamOptions: function() {
            var props = this.props,
                team = props.team,
                clubs = props.clubs,
                league = props.league;

            var clubsIds = league.clubs;
            clubs = clubs.filter(function(club){
                return clubsIds.indexOf(club._id) >= 0;
            });

            if (team.options.length) {
                return team.options.map(function(teamOptionId){
                    return utils.general.findItemInArrBy(clubs, "_id", teamOptionId);
                });
            } else {
                return clubs
            }
        },

        render: function() {
           var props = this.props,
               selectedTeam = props.selectedTeam,
               league = props.league,
               isDeadLine = props.isDeadLine;

           var items = [];

           if (isDeadLine) {
               if (selectedTeam.isDummySelection) {
                   //no prediction
                   items = [];
               } else {
                   items = [{
                       isSelected: true,
                       id: selectedTeam._id,
                       shortName: selectedTeam.shortName,
                       logoPosition: selectedTeam.logoPosition,
                       sprite: selectedTeam.sprite,
                       leagueName: league.name
                   }]
               }
           } else {
               items = this.state.teamOptions.sort(function(team1, team2){
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
                       sprite: teamOption.sprite,
                       leagueName: league.name
                   }
               });
           }

           return re("div", {className: "team-prediction-form"},
               isDeadLine ? null : re(Search, {onSearch: this.onSearch}),
               re(ImagesPagination, {items: items, onSelectedTeamChanged: props.onSelectedTeamChanged})
           );
       }
    });
})();


