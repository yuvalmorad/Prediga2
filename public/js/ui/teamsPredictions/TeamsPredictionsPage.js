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

        render: function() {
            var props = this.props,
                teams = props.teams,
                userPredictions = props.userPredictions,
                selectedLeagueId = props.selectedLeagueId,
                clubs = props.clubs,
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
                var league = utils.general.findItemInArrBy(leagues, "_id", team.league);
                var selectedTeam;
                if (prediction && prediction.team) {
                    selectedTeam = utils.general.findItemInArrBy(clubs, "_id", prediction.team);
                }
                return re(TeamPredictionTile, {team: team, selectedTeam: selectedTeam, league: league, prediction: prediction, key: teamId})
            });

            return re("div", { className: "content hasSubHeader" },
                re(LeaguesSubHeader, {}),
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
            leagues: state.leagues.leagues,
            selectedLeagueId: state.leagues.selectedLeagueId,
            clubs: state.leagues.clubs
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadTeamsPredictions: function(){dispatch(action.teamsPredictions.loadTeams())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(TeamsPredictionsPage);
})();


