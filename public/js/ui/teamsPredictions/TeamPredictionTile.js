component.TeamPredictionTile = (function(){
    var Tile = component.Tile,
        TeamPredictionMainTile = component.TeamPredictionMainTile;

    return React.createClass({
        shouldComponentUpdate: function(nextProps) {
            return this.props.team !== nextProps.team || this.props.prediction !== nextProps.prediction;
        },

        render: function() {
            var props = this.props,
                team = props.team,
                prediction = props.prediction,
                borderColor = "gray",
                borderSecondColor = "",
                selectedTeam;

            if (prediction && prediction.team) {
                var selectedTeam = models.leagues.getTeamByTeamName(prediction.team);
                borderColor = selectedTeam.color;
                borderSecondColor = selectedTeam.secondColor;
            }

            return re(Tile, {borderLeftColor: borderColor, borderLeftSecondColor: borderSecondColor, borderRightColor: borderColor, borderRightSecondColor: borderSecondColor, className: "team-prediction-tile", dialogComponent: "TeamPredictionTileDialog", dialogComponentProps: {team: team, prediction: prediction, isDialogFormDisabled: false}},
                re(TeamPredictionMainTile, {team: team, selectedTeam: selectedTeam})
            );
        }
    });
})();


