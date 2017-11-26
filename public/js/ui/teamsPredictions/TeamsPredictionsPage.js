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
            var teams = this.props.teamsPredictions.teams;

            var tilesElement = teams.map(function(team, index){
                return re(TeamPredictionTile, {team: team, key: "teamPrediction" + index})
            });

            return re("div", { className: "content" + (this.props.isShowTileDialog ? " no-scroll" : "") },
                tilesElement
            );
        }
    });

    function mapStateToProps(state){
        return {
            teamsPredictions: state.teamsPredictions,
            isShowTileDialog: state.general.isShowTileDialog
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadTeamsPredictions: function(){dispatch(action.teamsPredictions.loadTeams())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(TeamsPredictionsPage);
})();


