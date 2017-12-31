window.component = window.component || {};
component.TeamPredictionTile = (function(){
    var Tile = component.Tile,
        TeamPredictionMainTile = component.TeamPredictionMainTile;

    return React.createClass({
        shouldComponentUpdate: function(nextProps) {
            return this.props.team !== nextProps.team || this.props.prediction !== nextProps.prediction || this.props.selectedTeam !== nextProps.selectedTeam;//TODO all this?
        },

        render: function() {
            var props = this.props,
                team = props.team,
                prediction = props.prediction,
                borderColor = "gray",
                borderSecondColor = "",
                selectedTeam = props.selectedTeam,
                league = props.league;

            if (selectedTeam) {
                borderColor = selectedTeam.colors[0];
                borderSecondColor = selectedTeam.colors[1];
            }

            return re(Tile, {borderLeftColor: borderColor, borderLeftSecondColor: borderSecondColor, borderRightColor: borderColor, borderRightSecondColor: borderSecondColor, className: "team-prediction-tile", dialogComponent: "TeamPredictionTileDialog", dialogComponentProps: {team: team, prediction: prediction, isDialogFormDisabled: false}},
                re(TeamPredictionMainTile, {team: team, selectedTeam: selectedTeam, league: league})
            );
        }
    });
})();


