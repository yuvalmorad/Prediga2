window.component = window.component || {};
component.LeaderBoardTeamsHistory = (function(){
    var connect = ReactRedux.connect;
    var leaderBoardService = service.leaderBoard;

    var LeaderBoardTeamsHistory = React.createClass({
        getInitialState: function() {
            return {
                isLoading: true
            }
        },

        componentDidMount: function() {
            var that = this;
            leaderBoardService.getUserTeamPredictions(this.props.userId, this.props.selectedLeagueId, this.props.selectedGroupId).then(function(res){
                var data = res.data;
                that.setState({
                    teamPrediction: data.teamPrediction,
                    teamResults: data.teamResults,
                    teams: data.teams,
                    isLoading: false
                });
            });
        },

        onLeaderboardTeamClicked: function(teamId, event) {
            var state = this.state,
                props = this.props,
                team = utils.general.findItemInArrBy(state.teams, "_id", teamId),
                dialogComponentProps = {
                    team: team,
                    result: utils.general.findItemInArrBy(state.teamResults, "teamId", teamId),
                    prediction: utils.general.findItemInArrBy(state.teamPrediction, "teamId", teamId),
                    league: utils.general.findItemInArrBy(props.leagues, "_id", props.selectedLeagueId),
                    groupConfiguration: utils.general.getGroupConfiguration(props.groups, props.selectedGroupId, props.groupsConfiguration),
                    isDialogFormDisabled: true
                };

            event.stopPropagation();
            this.props.openTileDialog("TeamPredictionTileDialog", dialogComponentProps);
        },

        render: function() {
            var that = this,
                state = this.state,
                props = this.props,
                clubs = props.clubs,
                isLoading = state.isLoading,
                teamPrediction = state.teamPrediction || [],
                teamResults = state.teamResults || [],
                teams = state.teams || [],
                groupsConfiguration = props.groupsConfiguration,
                groupConfiguration;

            if (isLoading) {
                return re("div", {}, "");
            }

            if (!teams.length || !groupsConfiguration.length) {
                return re("div", {className: "no-content"}, "No results");
            }

            groupConfiguration = utils.general.getGroupConfiguration(props.groups, props.selectedGroupId, groupsConfiguration);

            teams.sort(function(matchTeam1, matchTeam2){
                return new Date(matchTeam2.resultTime) - new Date(matchTeam1.resultTime);
            });

            var rows = teams.map(function(matchTeam){
                var onClick;
                var item1, item2, item3;
                var points;
                var dateStr;

                var team = matchTeam,
                    teamId = team._id,
                    _teamPrediction = utils.general.findItemInArrBy(teamPrediction, "teamId", teamId),
                    teamResult = utils.general.findItemInArrBy(teamResults, "teamId", teamId),
                    clubIdRes = teamResult ? teamResult.team : null,
                    clubPrediction = utils.general.findItemInArrBy(clubs, "_id", _teamPrediction.team),
                    dateObj = new Date(team.resultTime),
                    teamTitle = team.title;

                dateStr = utils.general.formatDateByMonthAndDate(dateObj);
                points = _teamPrediction.team === clubIdRes ? groupConfiguration[team.type] : 0;
                onClick = that.onLeaderboardTeamClicked.bind(that, teamId);
                item1 = teamTitle;
                item2 = "-";
                item3 = clubPrediction.shortName;


                return re("div", {className: "leaderboard-match-row", onClick: onClick},
                    re ("div", {className: "match-date"}, dateStr),
                    re("div", {className: "teams-score"},
                        re("div", {}, item1),
                        re("div", {}, item2),
                        re("div", {}, item3)
                    ),
                    re("div", {},
                        re("div", {className: "points" + (points === 0 ? " zero" : "")}, points)
                    )
                );
            });

            return re("div", {className: "leaderboard-match-rows"}, rows);
        }
    });

    function mapStateToProps(state){
        return {
            clubs: state.leagues.clubs,
            leagues: state.leagues.leagues,
            selectedLeagueId: state.groups.selectedLeagueId,
            groupsConfiguration: state.groupsConfiguration.groupsConfiguration,
            selectedGroupId: state.groups.selectedGroupId,
            groups: state.groups.groups
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            openTileDialog: function(componentName, componentProps){dispatch(action.general.openTileDialog(componentName, componentProps))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(LeaderBoardTeamsHistory);
})();


