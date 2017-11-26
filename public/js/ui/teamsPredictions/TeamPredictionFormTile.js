component.TeamPredictionFormTile = (function(){
    var connect = ReactRedux.connect;
    var ImagesPagination = component.ImagesPagination;

    var TeamPredictionFormTile = React.createClass({

        onTeamSelected: function(teamId) {
            this.props.updateGame({
                id: teamId,
                rank: this.props.rank
            });
        },

        render: function() {
            var that = this,
                props = this.props,
                teams = LEAGUE.teams,
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
                re(ImagesPagination, {items: items})
            );
        }
    });

    function mapStateToProps(state){
        return {

        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateGame: function(team){dispatch(action.teamsPredictions.updateTeamSelected(team))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(TeamPredictionFormTile);
})();


