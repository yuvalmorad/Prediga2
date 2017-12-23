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
        },

        onDialogSave: function() {
            var defaults = {};
            defaults[GAME.BET_TYPES.WINNER.key] = "Draw";
            defaults[GAME.BET_TYPES.FIRST_TO_SCORE.key] = "None";
            defaults[GAME.BET_TYPES.TEAM1_GOALS.key] = 0;
            defaults[GAME.BET_TYPES.TEAM2_GOALS.key] = 0;
            defaults[GAME.BET_TYPES.GOAL_DIFF.key] = 0;
            var prediction = Object.assign(defaults, this.state.prediction);
            this.props.updateGame(prediction);
        },

        updateGameForm: function(predictionToUpdate) {
            var prediction = Object.assign({}, this.state.prediction, predictionToUpdate);
            this.setState({prediction: prediction});
        },

        render: function() {
            var state = this.state,
                props = this.props,
                prediction = state.prediction,
                game = props.game,
                hideMutualFriends = props.hideMutualFriends,
                team1 = props.team1,
                team2 = props.team2,
                league = props.league,
                result = props.result,
                isDialogFormDisabled = props.isDialogFormDisabled;

            return re(TileDialog, {borderLeftColor: team1.color, borderLeftSecondColor: team1.secondColor, borderRightColor: team2.color, borderRightSecondColor: team2.secondColor, className: "game-prediction-tile"},
                re(GamePredictionMainTile, {game: game, team1: team1, team2: team2, league: league, prediction: prediction, result: result, hideMutualFriends: hideMutualFriends}),
                re(GamePredictionFormTile, {game: game, team1: team1, team2: team2, league: league, prediction: prediction, result: result, updateGameForm: this.updateGameForm, isDialogFormDisabled: isDialogFormDisabled})
            );
        }
    });

    function mapStateToProps(state){
        return {
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateGame: function(prediction){dispatch(action.gamesPredictions.updateGame(prediction))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GamePredictionTileDialog);
})();


