component.GamePredictionTileDialog = (function(){
    var connect = ReactRedux.connect,
        TileDialog = component.TileDialog,
        GamePredictionMainTile = component.GamePredictionMainTile,
        GamePredictionFormTile = component.GamePredictionFormTile;

    var GamePredictionTileDialog = function(props) {
        var teams = LEAGUE.teams,
            game = props.games.filter(function(game){return game.id === props.id})[0],
            team1 = teams[game.team1Id],
            team2 = teams[game.team2Id];

        return re(TileDialog, {borderLeftColor: team1.color, borderRightColor: team2.color, className: "game-prediction-tile"},
            re(GamePredictionMainTile, {game: game}),
            re(GamePredictionFormTile, {game: game})
        );
    };

    function mapStateToProps(state){
        return {
            games: state.gamesPredictions.games
        }
    }

    return connect(mapStateToProps)(GamePredictionTileDialog);
})();


