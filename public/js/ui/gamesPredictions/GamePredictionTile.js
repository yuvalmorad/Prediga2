component.GamePredictionTile = (function(){
    var Tile = component.Tile,
        GamePredictionMainTile = component.GamePredictionMainTile;

    return function(props) {
        var teams = LEAGUE.teams,
            game = props.game,
            team1 = teams[game.team1Id],
            team2 = teams[game.team2Id];

        return re(Tile, {borderLeftColor: team1.color, borderRightColor: team2.color, className: "game-prediction-tile", dialogComponent: "GamePredictionTileDialog", dialogComponentProps:{id: game.id}},
            re(GamePredictionMainTile, {game: game})
        );
    }
})();


