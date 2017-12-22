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
                result = props.result,
                team1 = models.leagues.getTeamByTeamName(game.team1),
                team2 = models.leagues.getTeamByTeamName(game.team2),
                borderLeftColor = team1 ? team1.color : "",
                borderLeftSecondColor = team1 ? team1.secondColor : "",
                borderRightColor = team2 ? team2.color : "",
                borderRightSecondColor = team2 ? team2.secondColor : "",
                kickofftime = game.kickofftime,
                isDialogFormDisabled = !!result || utils.general.isGameClosed(kickofftime);

            var dialogComponentProps = Object.assign({}, props, {isDialogFormDisabled: isDialogFormDisabled});

            return re(Tile, {hasPrediction: !!prediction, borderLeftColor: borderLeftColor, borderLeftSecondColor: borderLeftSecondColor, borderRightColor: borderRightColor, borderRightSecondColor: borderRightSecondColor, className: "game-prediction-tile", dialogComponent: "GamePredictionTileDialog", dialogComponentProps: dialogComponentProps},
                re(GamePredictionMainTile, props)
            );
        }
    });
})();


