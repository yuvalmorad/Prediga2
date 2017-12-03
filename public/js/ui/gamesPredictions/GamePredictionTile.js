component.GamePredictionTile = (function(){
    var Tile = component.Tile,
        GamePredictionMainTile = component.GamePredictionMainTile;

    return React.createClass({
        shouldComponentUpdate: function(nextProps) {
            return this.props.game !== nextProps.game || this.props.prediction !== nextProps.prediction;
        },

        render: function() {
            var props = this.props,
                game = props.game,
                prediction = props.prediction,
                teams = LEAGUE.teams,
                team1 = teams[game.team1] || {},
                team2 = teams[game.team2] || {};

            return re(Tile, {borderLeftColor: team1.color, borderRightColor: team2.color, className: "game-prediction-tile", dialogComponent: "GamePredictionTileDialog", dialogComponentProps:{_id: game._id}},
                re(GamePredictionMainTile, {game: game, prediction: prediction})
            );
        }
    });
})();


