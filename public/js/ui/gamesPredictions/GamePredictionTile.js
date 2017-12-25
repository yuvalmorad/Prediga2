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
                kickofftime = game.kickofftime,
                prediction = props.prediction,
                result = props.result,
                team1 = props.team1,
                team2 = props.team2,
                groupConfiguration = props.groupConfiguration,
                borderLeftColor = team1 ? team1.homeColors[0] : "",
                borderLeftSecondColor = team1 ? team1.homeColors[1] : "",
                borderRightColor = team2 ? team2.awayColors[0] : "",
                borderRightSecondColor = team2 ? team2.awayColors[1] : "",
                isDialogFormDisabled = !!result || utils.general.isGameClosed(kickofftime, groupConfiguration);

            var dialogComponentProps = Object.assign({}, props, {isDialogFormDisabled: isDialogFormDisabled});

            return re(Tile, {hasPrediction: !!prediction, borderLeftColor: borderLeftColor, borderLeftSecondColor: borderLeftSecondColor, borderRightColor: borderRightColor, borderRightSecondColor: borderRightSecondColor, className: "game-prediction-tile", dialogComponent: "GamePredictionTileDialog", dialogComponentProps: dialogComponentProps},
                re(GamePredictionMainTile, props)
            );
        }
    });
})();


