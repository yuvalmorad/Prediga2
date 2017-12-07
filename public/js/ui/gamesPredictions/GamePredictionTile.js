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
                otherMatchPredictions = props.otherMatchPredictions,
                result = props.result,
                teams = models.leagues.getTeamsByLeagueName(game.league),
                team1 = teams[game.team1],
                team2 = teams[game.team2],
                borderLeftColor = team1 ? team1.color : "",
                borderRightColor = team2 ? team2.color : "",
                disableOpen = !team1 || !team2;

            return re(Tile, {disableOpen: disableOpen, borderLeftColor: borderLeftColor, borderRightColor: borderRightColor, className: "game-prediction-tile", dialogComponent: "GamePredictionTileDialog", dialogComponentProps:{_id: game._id, isDialogFormDisabled: !!result}},
                re(GamePredictionMainTile, {game: game, prediction: prediction,otherMatchPredictions: otherMatchPredictions, result: result})
            );
        }
    });
})();


