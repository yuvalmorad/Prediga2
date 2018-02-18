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
                borderColor = "#a7a4a4",
                borderSecondColor = "",
                selectedTeam = props.selectedTeam,
                league = props.league,
                predictionCounters = props.predictionCounters,
                usersInGroupCount = props.usersInGroupCount,
                groupConfiguration = props.groupConfiguration,
                result = props.result;

            if (selectedTeam) {
                borderColor = selectedTeam.colors[0];
                borderSecondColor = selectedTeam.colors[1];
            }

            return re(Tile, {borderLeftColor: borderColor, borderLeftSecondColor: borderSecondColor, borderRightColor: borderColor, borderRightSecondColor: borderSecondColor, className: "team-prediction-tile", dialogComponent: "TeamPredictionTileDialog", dialogComponentProps: {team: team, prediction: prediction, predictionCounters: predictionCounters, usersInGroupCount: usersInGroupCount, groupConfiguration: groupConfiguration, result: result, isDialogFormDisabled: false}},
                re(TeamPredictionMainTile, {team: team, selectedTeam: selectedTeam, league: league, predictionCounters: predictionCounters, usersInGroupCount: usersInGroupCount, groupConfiguration: groupConfiguration, result: result})
            );
        }
    });
})();


