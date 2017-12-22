component.TeamsPredictionsPage = (function(){
    var connect = ReactRedux.connect,
        TeamPredictionTile = component.TeamPredictionTile,
        LeaguesSubHeader = component.LeaguesSubHeader;

    var isTeamsPredictionsRequestSent = false;

    var TeamsPredictionsPage = React.createClass({
        getInitialState: function() {
            if (!isTeamsPredictionsRequestSent) {
                this.props.loadTeamsPredictions();
                isTeamsPredictionsRequestSent = true;
            }

            return {};
        },

        onLeagueClicked: function(selectedLeagueId) {
            this.props.setSelectedLeagueId(selectedLeagueId);
        },

        render: function() {
            var props = this.props,
                teams = props.teams,
                userPredictions = props.userPredictions,
                selectedLeagueId = props.selectedLeagueId,
                leagues = props.leagues;

            //filter teams with selected league id
            teams = teams.filter(function(team){
                return team.league === selectedLeagueId;
            });

            var tiles = teams.sort(function(team1, team2){
                return new Date(team1.deadline) - new Date(team2.deadline);
            }).map(function(team){
                var teamId = team._id;
                var prediction = utils.general.findItemInArrBy(userPredictions, "teamId", teamId);
                return re(TeamPredictionTile, {team: team, prediction: prediction, key: teamId})
            });

            return re("div", { className: "content hasSubHeader" },
                re(LeaguesSubHeader, {leagues: leagues, selectedLeagueId: selectedLeagueId, onLeagueClicked: this.onLeagueClicked}),
                re("div", {className: "tiles" + (props.isShowTileDialog ? " no-scroll" : "")},
                    tiles
                )
            );
        }
    });

    function mapStateToProps(state){
        return {
            teams: state.teamsPredictions.teams,
            userPredictions: state.teamsPredictions.userPredictions,
            isShowTileDialog: state.general.isShowTileDialog,
            selectedLeagueId: state.leagues.selectedLeagueId,
            leagues: state.leagues.leagues
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadTeamsPredictions: function(){dispatch(action.teamsPredictions.loadTeams())},
            setSelectedLeagueId: function(leagueId){dispatch(action.leagues.setSelectedLeagueId(leagueId))},
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(TeamsPredictionsPage);
})();


