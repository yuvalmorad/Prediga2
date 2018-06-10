window.component = window.component || {};
component.GamePredictionTile = (function(){
    var Tile = component.Tile,
        GamePredictionMainTile = component.GamePredictionMainTile;

    return React.createClass({
        shouldComponentUpdate: function(nextProps) {
            return this.props.game !== nextProps.game || this.props.prediction !== nextProps.prediction || this.props.result !== nextProps.result;
        },

        render: function() {
            var props = this.props,
				prevClicked = props.prevClicked,
                game = props.game,
                kickofftime = game.kickofftime,
                prediction = props.prediction,
                result = props.result,
                team1 = props.team1,
                team2 = props.team2,
                groupConfiguration = props.groupConfiguration,
                borderLeftColor = team1 ? team1.colors[0] : "",
                borderLeftSecondColor = team1 ? team1.colors[1] : "",
                borderRightColor = team2 ? team2.colors[0] : "",
                borderRightSecondColor = team2 ? team2.colors[1] : "",
                isDialogFormDisabled = utils.general.getGameStatus(result) === GAME.STATUS.PRE_GAME ? utils.general.isGameClosed(kickofftime, groupConfiguration) : true;

            var dialogComponentProps = Object.assign({}, props, {isDialogFormDisabled: isDialogFormDisabled});

            var animation = {
                name: (prevClicked ? "moveRight" : "moveLeft")
            };

            return re(Tile, {animation: animation, disableOpen: !team1 || !team2, hasPrediction: !!prediction, borderLeftColor: borderLeftColor, borderLeftSecondColor: borderLeftSecondColor, borderRightColor: borderRightColor, borderRightSecondColor: borderRightSecondColor, className: "game-prediction-tile", dialogComponent: "GamePredictionTileDialog", dialogComponentProps: dialogComponentProps},
                re(GamePredictionMainTile, props)
            );
        }
    });
})();


