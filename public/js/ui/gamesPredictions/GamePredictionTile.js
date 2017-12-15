component.GamePredictionTile = (function(){
    var Tile = component.Tile,
        GamePredictionMainTile = component.GamePredictionMainTile;

    function isGameClosed(kickofftime) {
        var currentDate = new Date();
        var gameClosedDate = new Date(kickofftime);
        gameClosedDate.setHours(gameClosedDate.getHours() - 1);
        return currentDate >= gameClosedDate;
    }

    return React.createClass({
        shouldComponentUpdate: function(nextProps) {
            return this.props.game !== nextProps.game || this.props.prediction !== nextProps.prediction;
        },

        render: function() {
            var props = this.props,
                game = props.game,
                prediction = props.prediction,
                result = props.result,
                team1 = models.leagues.getTeamByTeamName(game.team1),
                team2 = models.leagues.getTeamByTeamName(game.team2),
                borderLeftColor = team1 ? team1.color : "",
                borderRightColor = team2 ? team2.color : "",
                kickofftime = game.kickofftime,
                isDialogFormDisabled = !!result || isGameClosed(kickofftime);

            var dialogComponentProps = Object.assign({}, props, {isDialogFormDisabled: isDialogFormDisabled});

            return re(Tile, {hasPrediction: !!prediction, borderLeftColor: borderLeftColor, borderRightColor: borderRightColor, className: "game-prediction-tile", dialogComponent: "GamePredictionTileDialog", dialogComponentProps: dialogComponentProps},
                re(GamePredictionMainTile, props)
            );
        }
    });
})();


