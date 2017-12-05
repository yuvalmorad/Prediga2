component.GamePredictionTileDialog = (function(){
    var connect = ReactRedux.connect,
        TileDialog = component.TileDialog,
        GamePredictionMainTile = component.GamePredictionMainTile,
        GamePredictionFormTile = component.GamePredictionFormTile;

    var GamePredictionTileDialog = React.createClass({

        getInitialState: function() {
            var props = this.props,
                matchId = props._id,
                game = props.matches.filter(function(game){return game._id === matchId})[0],
                prediction = utils.general.findItemInArrBy(props.userPredictions, "matchId", matchId),
                result = utils.general.findItemInArrBy(props.results, "matchId", matchId),
                predictionCopy = Object.assign({}, {matchId: matchId, goalDiff: 0, team1Goals: 0, team2Goals: 0}, prediction);

            return {
                game: game,
                prediction: predictionCopy,
                result: result
            };
        },

        componentDidMount: function() {
          this.props.onDialogSave(this.onDialogSave);
        },

        onDialogSave: function() {
            this.props.updateGame(this.state.prediction);
        },

        updateGameForm: function(predictionToUpdate) {
            var prediction = Object.assign({}, this.state.prediction, predictionToUpdate);
            this.setState({prediction: prediction});
        },

        render: function() {
            var teams = LEAGUE.teams,
                state = this.state,
                game = state.game,
                prediction = state.prediction,
                result = state.result,
                team1 = teams[game.team1],
                team2 = teams[game.team2];

            return re(TileDialog, {borderLeftColor: team1.color, borderRightColor: team2.color, className: "game-prediction-tile"},
                re(GamePredictionMainTile, {game: game, prediction: prediction, result: result}),
                re(GamePredictionFormTile, {game: game, prediction: prediction, result: result, updateGameForm: this.updateGameForm})
            );
        }
    });

    function mapStateToProps(state){
        return {
            matches: state.gamesPredictions.matches,
            userPredictions: state.gamesPredictions.userPredictions,
            results: state.gamesPredictions.results
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateGame: function(prediction){dispatch(action.gamesPredictions.updateGame(prediction))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GamePredictionTileDialog);
})();


