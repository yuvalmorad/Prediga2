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
                predictionCopy = Object.assign({}, prediction, {matchId: matchId});

            return {
                game: game,
                prediction: predictionCopy
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
                team1 = teams[game.team1],
                team2 = teams[game.team2];

            return re(TileDialog, {borderLeftColor: team1.color, borderRightColor: team2.color, className: "game-prediction-tile"},
                re(GamePredictionMainTile, {game: game, prediction: prediction}),
                re(GamePredictionFormTile, {game: game, prediction: prediction, updateGameForm: this.updateGameForm})
            );
        }
    });

    function mapStateToProps(state){
        return {
            matches: state.gamesPredictions.matches,
            userPredictions: state.gamesPredictions.userPredictions
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateGame: function(prediction){dispatch(action.gamesPredictions.updateGame(prediction))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GamePredictionTileDialog);
})();


