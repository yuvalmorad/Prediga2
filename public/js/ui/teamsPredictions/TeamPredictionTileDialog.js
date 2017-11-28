component.TeamPredictionTileDialog = (function(){
    var connect = ReactRedux.connect,
        TileDialog = component.TileDialog,
        TeamPredictionMainTile = component.TeamPredictionMainTile,
        TeamPredictionFormTile = component.TeamPredictionFormTile;

    var TeamPredictionTileDialog = React.createClass({

        componentDidMount: function() {
            this.props.onDialogSave(this.onDialogSave);
        },

        onDialogSave: function() {
            //TODO
        },

        render: function() {
            var props = this.props,
                rank = props.rank,
                selectedTeam = props.teams.filter(function(team){return team.rank === rank})[0],
                borderColor = "gray",
                team,
                teamId = selectedTeam.id;

            if (teamId) {
                team = LEAGUE.teams[teamId];
                borderColor = team.color;
            }

            return re(TileDialog, {borderLeftColor: borderColor, borderRightColor: borderColor, className: "team-prediction-tile"},
                re(TeamPredictionMainTile, {team: team, teamRecords: selectedTeam}),
                re(TeamPredictionFormTile, {team: team, rank: rank})
            );
        }
    });

    function mapStateToProps(state){
        return {
            teams: state.teamsPredictions.teams
        }
    }

    return connect(mapStateToProps)(TeamPredictionTileDialog);
})();


