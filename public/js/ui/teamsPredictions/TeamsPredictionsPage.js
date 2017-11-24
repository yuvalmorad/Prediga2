component.TeamsPredictionsPage = (function(){
    var connect = ReactRedux.connect,
        TeamPredictionTile = component.TeamPredictionTile;

    var isTeamsPredictionsRequestSent = false;

    var TeamsPredictionsPage = React.createClass({
        getInitialState: function() {
            if (!isTeamsPredictionsRequestSent) {
                this.props.loadTeamsPredictions();
                isTeamsPredictionsRequestSent = true;
            }

            return {};
        },

        render: function() {
            var teams = this.props.teamsPredictions.teams,
                tiles = [],
                i;

            /*for (i = 0; i < NUM_OF_TEAMS; i++) {
                var currentRank = i + 1;
                var team = teams.filter(function(team){
                    return team.rank === currentRank;
                })[0];

                if (team) {
                    tiles.push({
                        rank: currentRank,
                        selectedTeam: team
                    });
                } else {
                    //no team of this rank in teams predictions
                    tiles.push({
                        rank: currentRank
                    })
                }
            }

            var tilesElement = tiles.map(function(tile, index){
                return re(TeamPredictionTile, {selectedTeam: tile.selectedTeam, rank: tile.rank, key: "teamPrediction" + index})
            });*/

            var tilesElement = teams.map(function(team, index){
                return re(TeamPredictionTile, {team: team, key: "teamPrediction" + index})
            });

            return re("div", { className: "content" },
                tilesElement
            );
        }
    });

    function mapStateToProps(state){
        return {
            teamsPredictions: state.teamsPredictions
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadTeamsPredictions: function(){dispatch(action.teamsPredictions.loadTeams())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(TeamsPredictionsPage);
})();


