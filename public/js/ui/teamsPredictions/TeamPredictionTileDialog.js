component.TeamPredictionTileDialog = (function(){
    var connect = ReactRedux.connect,
        TileDialog = component.TileDialog,
        TeamPredictionMainTile = component.TeamPredictionMainTile,
        TeamPredictionFormTile = component.TeamPredictionFormTile;

    var TeamPredictionTileDialog = React.createClass({

        getInitialState: function() {
            var props = this.props,
                prediction = props.prediction,
                team = props.team,
                predictionCopy = Object.assign({}, prediction, {teamId: team._id});

            if (!predictionCopy.team) {
                predictionCopy.team = team.options.length ? team.options[0] : Object.keys(LEAGUE.teams)[0];
            }

            return {
                prediction: predictionCopy
            };
        },

        componentDidMount: function() {
            this.props.onDialogSave(this.onDialogSave);
        },

        onSelectedTeamChanged: function(teamName) {
            this.setState({
                prediction: Object.assign({}, this.state.prediction, {team: teamName})
            });
        },

        onDialogSave: function() {
            this.props.updateTeamSelected(this.state.prediction);
        },

        render: function() {
            var props = this.props,
                state = this.state,
                prediction = state.prediction,
                team = props.team,
                selectedTeam,
                borderColor = "gray";

            if (prediction && prediction.team) {
                selectedTeam = LEAGUE.teams[prediction.team];
                borderColor = selectedTeam.color;
            }

            return re(TileDialog, {borderLeftColor: borderColor, borderRightColor: borderColor, className: "team-prediction-tile"},
                re(TeamPredictionMainTile, {team: team, selectedTeam: selectedTeam, fixedDescription: LEAGUE.name}),
                re(TeamPredictionFormTile, {team: team, selectedTeam: selectedTeam, onSelectedTeamChanged: this.onSelectedTeamChanged})
            );
        }
    });

    function mapStateToProps(state){
        return {
            /*teams: state.teamsPredictions.teams*/
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateTeamSelected: function(prediction){dispatch(action.teamsPredictions.updateTeamSelected(prediction))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(TeamPredictionTileDialog);
})();


