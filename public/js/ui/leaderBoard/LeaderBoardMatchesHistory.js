window.component = window.component || {};
component.LeaderBoardMatchesHistory = (function(){
    var connect = ReactRedux.connect;
    var leaderBoardService = service.leaderBoard;

    var LeaderBoardMatchesHistory = React.createClass({
        getInitialState: function() {
            return {
                isLoading: true
            }
        },

        componentDidMount: function() {
            var that = this;
            leaderBoardService.getUserMatchPredictions(this.props.userId, this.props.selectedLeagueId, this.props.selectedGroupId).then(function(res){
                var data = res.data;
                that.setState({
                    matches: data.matches,
                    predictions: data.predictions,
                    results: data.results,
                    teamPrediction: data.teamPrediction,
                    teamResults: data.teamResults,
                    teams: data.teams,
                    isLoading: false
                });
            });
        },

        onLeaderboardMatchClicked: function(matchId, event) {
            var state = this.state,
                props = this.props,
                match = utils.general.findItemInArrBy(state.matches, "_id", matchId),
                dialogComponentProps = {
                    game: match,
                    result: utils.general.findItemInArrBy(state.results, "matchId", matchId),
                    prediction: utils.general.findItemInArrBy(state.predictions, "matchId", matchId),
                    team1: utils.general.findItemInArrBy(props.clubs, "_id", match.team1),
                    team2: utils.general.findItemInArrBy(props.clubs, "_id", match.team2),
                    league: utils.general.findItemInArrBy(props.leagues, "_id", props.selectedLeagueId),
                    isDialogFormDisabled: true
                };

            event.stopPropagation();
            this.props.openTileDialog("GamePredictionTileDialog", dialogComponentProps);
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
                matches = state.matches || [],
                predictions = state.predictions || [],
                results = state.results || [],
                teamPrediction = state.teamPrediction || [],
                teamResults = state.teamResults || [],
                teams = state.teams || [],
                groupsConfiguration = props.groupsConfiguration,
                groupConfiguration;

            if (isLoading) {
                return re("div", {}, "");
            }

            if (!matches.length || !groupsConfiguration.length) {
                return re("div", {className: "no-content"}, "No results");
            }

            groupConfiguration = utils.general.getGroupConfiguration(props.groups, props.selectedGroupId, groupsConfiguration);

            //matches

            matches = matches.filter(function(match){
                var matchId = match._id;
                return utils.general.findItemInArrBy(predictions, "matchId", matchId) &&
                        utils.general.findItemInArrBy(results, "matchId", matchId)
            });

            var matchesAndTeams = matches.concat(teams);

            matchesAndTeams.sort(function(matchTeam1, matchTeam2){
                return new Date(matchTeam2.kickofftime || matchTeam2.resultTime) - new Date(matchTeam1.kickofftime || matchTeam1.resultTime);
            });

            //get first six matches and teams
            matchesAndTeams = matchesAndTeams.splice(0,6);

            var rows = matchesAndTeams.map(function(matchTeam){
                var onClick;
                var item1, item2, item3;
                var points;
                var dateStr;

                if (matchTeam.kickofftime) {
                    //match

                    var match = matchTeam,
                        matchId = match._id,
                        dateObj = new Date(match.kickofftime),
                        matchResult = utils.general.findItemInArrBy(results, "matchId", matchId),
                        matchPrediction = utils.general.findItemInArrBy(predictions, "matchId", matchId),
                        team1 = utils.general.findItemInArrBy(clubs, "_id", match.team1),
                        team2 = utils.general.findItemInArrBy(clubs, "_id", match.team2),
                        team1GoalsResult = matchPrediction && matchPrediction[GAME.BET_TYPES.TEAM1_GOALS.key],
                        team2GoalsResult = matchPrediction && matchPrediction[GAME.BET_TYPES.TEAM2_GOALS.key],
                        score = matchPrediction ? team1GoalsResult + " - " + team2GoalsResult : "(No Prediction)";

                    dateStr = utils.general.formatDateByMonthAndDate(dateObj);
                    points = utils.general.calculateTotalPoints(matchPrediction, matchResult, groupConfiguration);
                    onClick = that.onLeaderboardMatchClicked.bind(that, matchId);
                    item1 = team1.name;
                    item2 = score;
                    item3 = team2.name;
                } else {
                    //team
                    var team = matchTeam,
                        teamId = team._id,
                        _teamPrediction = utils.general.findItemInArrBy(teamPrediction, "teamId", teamId),
                        teamResult = utils.general.findItemInArrBy(teamResults, "teamId", teamId),
                        clubIdRes = teamResult.team,
                        clubPrediction = utils.general.findItemInArrBy(clubs, "_id", _teamPrediction.team),
                        dateObj = new Date(team.resultTime),
                        teamTitle = team.title;

                    dateStr = utils.general.formatDateByMonthAndDate(dateObj);
                    points = _teamPrediction.team === clubIdRes ? groupConfiguration[team.type] : 0;
                    onClick = that.onLeaderboardTeamClicked.bind(that, teamId);
                    item1 = teamTitle;
                    item2 = "-";
                    item3 = clubPrediction.shortName;
                }

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

    return connect(mapStateToProps, mapDispatchToProps)(LeaderBoardMatchesHistory);
})();


