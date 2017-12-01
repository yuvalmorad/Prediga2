component.TeamPredictionTileDialog = (function(){
    var connect = ReactRedux.connect,
        TileDialog = component.TileDialog,
        TeamPredictionMainTile = component.TeamPredictionMainTile,
        TeamPredictionFormTile = component.TeamPredictionFormTile;

    var TeamPredictionTileDialog = React.createClass({

        getInitialState: function() {
            var props = this.props,
                rank = props.rank,
                selectedTeam = props.teams.filter(function(team){return team.rank === rank})[0],
                selectedTeamCopy = Object.assign({}, selectedTeam);

            if (selectedTeam.id === undefined) {
                var firstTeamKeyId = Object.keys(LEAGUE.teams)[0];
                selectedTeamCopy.id = firstTeamKeyId;
            }

            return {
                selectedTeam: selectedTeamCopy
            };
        },

        componentDidMount: function() {
            this.props.onDialogSave(this.onDialogSave);
        },

        onSelectedTeamChanged: function(teamId) {
            this.setState({
                selectedTeam: {
                    rank: this.state.selectedTeam.rank,
                    id: teamId
                }
            });
        },

        onDialogSave: function() {
            var selectedTeam = this.state.selectedTeam;
            this.props.updateTeamSelected({
                rank: selectedTeam.rank,
                id: selectedTeam.id
            });
        },

        render: function() {
            var props = this.props,
                state = this.state,
                rank = props.rank,
                selectedTeam = state.selectedTeam,
                borderColor = "gray",
                team,
                teamId = selectedTeam.id;

            if (teamId) {
                team = LEAGUE.teams[teamId];
                borderColor = team.color;
            }

            return re(TileDialog, {borderLeftColor: borderColor, borderRightColor: borderColor, className: "team-prediction-tile"},
                re(TeamPredictionMainTile, {team: team, teamRecords: selectedTeam, fixedDescription: LEAGUE.name}),
                re(TeamPredictionFormTile, {team: team, rank: rank, onSelectedTeamChanged: this.onSelectedTeamChanged})
            );
        }
    });

    function mapStateToProps(state){
        return {
            teams: state.teamsPredictions.teams
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateTeamSelected: function(team){dispatch(action.teamsPredictions.updateTeamSelected(team))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(TeamPredictionTileDialog);
})();


