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
                otherMatchPredictions = utils.general.findItemsInArrBy(props.otherPredictions, "matchId", matchId),
                result = utils.general.findItemInArrBy(props.results, "matchId", matchId),
                predictionCopy = Object.assign({}, {matchId: matchId}, prediction);

            return {
                game: game,
                prediction: predictionCopy,
                otherMatchPredictions: otherMatchPredictions,
                result: result
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
                game = state.game,
                team1 = models.leagues.getTeamByTeamName(game.team1),
                team2 = models.leagues.getTeamByTeamName(game.team2),
                users = props.users,
                prediction = state.prediction,
                otherMatchPredictions = state.otherMatchPredictions,
                result = state.result,
                userId = props.userId,
                isDialogFormDisabled = props.isDialogFormDisabled;

            return re(TileDialog, {borderLeftColor: team1.color, borderRightColor: team2.color, className: "game-prediction-tile"},
                re(GamePredictionMainTile, {game: game, prediction: prediction, otherMatchPredictions: otherMatchPredictions, result: result}),
                re(GamePredictionFormTile, {game: game, prediction: prediction, otherMatchPredictions: otherMatchPredictions, result: result, users: users, userId: userId, updateGameForm: this.updateGameForm, isDialogFormDisabled: isDialogFormDisabled})
            );
        }
    });

    function mapStateToProps(state){
        return {
            matches: state.gamesPredictions.matches,
            userPredictions: state.gamesPredictions.userPredictions,
            otherPredictions: state.gamesPredictions.otherPredictions,
            users: state.gamesPredictions.users,
            results: state.gamesPredictions.results,
            userId: state.authentication.userId
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateGame: function(prediction){dispatch(action.gamesPredictions.updateGame(prediction))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GamePredictionTileDialog);
})();


