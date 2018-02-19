window.component = window.component || {};
component.GamePredictionTileDialog = (function(){
    var connect = ReactRedux.connect,
        TileDialog = component.TileDialog,
        GamePredictionMainTile = component.GamePredictionMainTile,
        GamePredictionFormTile = component.GamePredictionFormTile;

    var GamePredictionTileDialog = React.createClass({

        getInitialState: function() {
            var props = this.props,
                predictionCopy = Object.assign({}, {matchId: props.game._id}, props.prediction);

            return {
                prediction: predictionCopy
            };
        },

        componentDidMount: function() {
          this.props.onDialogSave(this.onDialogSave);
          this.props.setSaveButtonEnabled(false);
        },

        onDialogSave: function() {
            this.props.updateGame(this.state.prediction, this.props.selectedGroupId);
        },

        updateGameForm: function(predictionToUpdate) {
            var prediction = Object.assign({}, this.state.prediction, predictionToUpdate);
            this.setState({prediction: prediction});

            if (utils.general.isAllBetTypesExists(prediction)) {
                this.props.setSaveButtonEnabled(true);
            }
        },

        randomGamePrediction: function() {
            this.props.randomGamePrediction(this.props.selectedGroupId, this.props.game._id);
            this.props.closeDialog();
        },

        render: function() {
            var state = this.state,
                props = this.props,
                prediction = state.prediction,
                game = props.game,
                team1 = props.team1,
                team2 = props.team2,
                league = props.league,
                result = props.result,
                groupConfiguration = utils.general.getGroupConfiguration(props.groups, props.selectedGroupId, props.groupsConfiguration),
                predictionCounters = props.predictionCounters,
                isDialogFormDisabled = props.isDialogFormDisabled;

            return re(TileDialog, {borderLeftColor: team1.colors[0], borderLeftSecondColor: team1.colors[1], borderRightColor: team2.colors[0], borderRightSecondColor: team2.colors[1], className: "game-prediction-tile"},
                re(GamePredictionMainTile, {game: game, team1: team1, team2: team2, league: league, prediction: prediction, result: result, groupConfiguration: groupConfiguration, predictionCounters: predictionCounters, updateGameForm: this.updateGameForm, randomGamePrediction: this.randomGamePrediction, isDialogFormDisabled: isDialogFormDisabled}),
                re(GamePredictionFormTile, {game: game, team1: team1, team2: team2, league: league, prediction: prediction, result: result, groupConfiguration: groupConfiguration, updateGameForm: this.updateGameForm, isDialogFormDisabled: isDialogFormDisabled})
            );
        }
    });

    function mapStateToProps(state){
        return {
            groupsConfiguration: state.groupsConfiguration.groupsConfiguration,
            selectedGroupId: state.groups.selectedGroupId,
            groups: state.groups.groups
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateGame: function(prediction, groupId){dispatch(action.gamesPredictions.updateGame(prediction, groupId))},
            randomGamePrediction: function(groupId, matchId){dispatch(action.gamesPredictions.randomGamePrediction(groupId, matchId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GamePredictionTileDialog);
})();


