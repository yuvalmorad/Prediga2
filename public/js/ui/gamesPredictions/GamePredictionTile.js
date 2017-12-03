component.GamePredictionTile = (function(){
    var Tile = component.Tile,
        GamePredictionMainTile = component.GamePredictionMainTile;

    return React.createClass({
        shouldComponentUpdate: function(nextProps) {
            return this.props.game !== nextProps.game;
        },

        render: function() {
            var props = this.props,
                teams = LEAGUE.teams,
                game = props.game,
                team1 = teams[game.team1] || {},
                team2 = teams[game.team2] || {};

            return re(Tile, {borderLeftColor: team1.color, borderRightColor: team2.color, className: "game-prediction-tile", dialogComponent: "GamePredictionTileDialog", dialogComponentProps:{id: game._id}},
                re(GamePredictionMainTile, {game: game})
            );
        }
    });
})();


