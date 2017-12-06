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
            var teams = this.props.teams,
                userPredictions = this.props.userPredictions;

            var tiles = teams.map(function(team){
                var teamId = team._id;
                var prediction = utils.general.findItemInArrBy(userPredictions, "teamId", teamId);
                return re(TeamPredictionTile, {team: team, prediction: prediction, key: teamId})
            });

            return re("div", { className: "content" },
                re("div", {className: "tiles" + (this.props.isShowTileDialog ? " no-scroll" : "")},
                    tiles
                )
            );
        }
    });

    function mapStateToProps(state){
        return {
            teams: state.teamsPredictions.teams,
            userPredictions: state.teamsPredictions.userPredictions,
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


