component.GamePredictionTileDialog = (function(){
    var connect = ReactRedux.connect,
        TileDialog = component.TileDialog,
        GamePredictionMainTile = component.GamePredictionMainTile,
        GamePredictionFormTile = component.GamePredictionFormTile;

    var GamePredictionTileDialog = React.createClass({

        getInitialState: function() {
            var props = this.props,
                game = props.matches.filter(function(game){return game.id === props.id})[0],
                gameCopy = Object.assign({}, game);

            return {
                game: gameCopy
            };
        },

        componentDidMount: function() {
          this.props.onDialogSave(this.onDialogSave);
        },

        onDialogSave: function() {
            this.props.updateGame(this.state.game);
        },

        updateGameForm: function(gameToUpdate) {
            var game = Object.assign({}, this.state.game, gameToUpdate);
            this.setState({game: game});
        },

        render: function() {
            var teams = LEAGUE.teams,
                state = this.state,
                game = state.game,
                team1 = teams[game.team1],
                team2 = teams[game.team2];

            return re(TileDialog, {borderLeftColor: team1.color, borderRightColor: team2.color, className: "game-prediction-tile"},
                re(GamePredictionMainTile, {game: game}),
                re(GamePredictionFormTile, {game: game, updateGameForm: this.updateGameForm})
            );
        }
    });

    function mapStateToProps(state){
        return {
            matches: state.gamesPredictions.matches
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateGame: function(game){dispatch(action.gamesPredictions.updateGame(game))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GamePredictionTileDialog);
})();


