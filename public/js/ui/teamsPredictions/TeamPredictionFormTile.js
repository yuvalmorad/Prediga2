component.TeamPredictionFormTile = (function(){
    var connect = ReactRedux.connect;

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
                teamSelected = props.team,
                teamSelectedId = teamSelected ? teamSelected.id : null,
                teams = LEAGUE.teams,
                teamsElements = Object.keys(teams).map(function(teamId){
                    var logo = teams[teamId].logoGray;

                    if (teamSelectedId) {
                        if (teamSelectedId === teamId) {
                            logo = teams[teamId].logo;
                        }
                    }
                    return re("img", {onClick: that.onTeamSelected.bind(that, teamId), key: teamId, src: "../images/teamsLogo/" + logo});
                });

            return re("div", {className: "team-prediction-form"},
                teamsElements
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


