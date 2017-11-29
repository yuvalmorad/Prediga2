component.TeamPredictionTile = (function(){
    var Tile = component.Tile,
        TeamPredictionMainTile = component.TeamPredictionMainTile;

    return React.createClass({
        shouldComponentUpdate: function(nextProps) {
            return this.props.team !== nextProps.team;
        },

        render: function() {
            var props = this.props,
                selectedTeam = props.team,
                borderColor = "gray",
                team,
                teamId = selectedTeam.id;

            if (teamId) {
                team = LEAGUE.teams[teamId];
                borderColor = team.color;
            }

            return re(Tile, {borderLeftColor: borderColor, borderRightColor: borderColor, className: "team-prediction-tile", dialogComponent: "TeamPredictionTileDialog", dialogComponentProps: {rank: selectedTeam.rank}},
                re(TeamPredictionMainTile, {team: team, teamRecords: selectedTeam})
            );
        }
    });
})();


