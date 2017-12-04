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
                selectedTeam;

            if (prediction && prediction.team) {
                selectedTeam = LEAGUE.teams[prediction.team];
                borderColor = selectedTeam.color;
            }

            return re(Tile, {borderLeftColor: borderColor, borderRightColor: borderColor, className: "team-prediction-tile", dialogComponent: "TeamPredictionTileDialog", dialogComponentProps: {team: team, prediction: prediction}},
                re(TeamPredictionMainTile, {team: team, selectedTeam: selectedTeam})
            );
        }
    });
})();


