window.component = window.component || {};
component.TeamsPredictionsPage = (function(){
    var connect = ReactRedux.connect,
        TeamPredictionTile = component.TeamPredictionTile,
        LeaguesSubHeader = component.LeaguesSubHeader;

    var TeamsPredictionsPage = React.createClass({
        getInitialState: function() {
            if (this.props.selectedGroupId) {
                this.props.loadTeamsPredictions(this.props.selectedGroupId);
            }

            return {};
        },

        componentWillReceiveProps: function(nextProps) {
            if (nextProps.selectedGroupId !== this.props.selectedGroupId) {
                //changed group selection -> load matches of selected group id
                this.props.loadTeamsPredictions(nextProps.selectedGroupId);
            }
        },

        mapTeamsByDeadLines: function(teams) {
            var deadLines = {};

            teams.forEach(function(team) {
                var deadLineStr = utils.general.formatDeadLineToDayString(team.deadline);
                if (!deadLines[deadLineStr]) {
                    deadLines[deadLineStr] = {
                        deadline: deadLineStr,
                        teams: []
                    }
                }

                deadLines[deadLineStr].teams.push(team);
            });

            return Object.keys(deadLines).map(function(key){return deadLines[key]});
        },

        render: function() {
            var props = this.props,
                teams = props.teams,
                predictionsCounters = props.predictionsCounters || {},
                userPredictions = props.userPredictions,
                selectedLeagueId = props.selectedLeagueId,
                clubs = props.clubs,
                leagues = props.leagues,
                groups = props.groups,
                selectedGroupId = props.selectedGroupId,
                groupsConfiguration = props.groupsConfiguration || [],
                results = props.results;

            var groupConfiguration = utils.general.getGroupConfiguration(groups, selectedGroupId, groupsConfiguration);

            //filter teams with selected league id
            teams = teams.filter(function(team){
                return team.league === selectedLeagueId;
            });

            var deadLines = this.mapTeamsByDeadLines(teams);

            var tiles = deadLines.map(function(deadLineObj, deadLineIndex){
                var tilesInGroup = deadLineObj.teams.sort(function(team1, team2){
                    return new Date(team1.deadline) - new Date(team2.deadline);
                }).map(function(team){
                    var teamId = team._id;
                    var prediction = utils.general.findItemInArrBy(userPredictions, "teamId", teamId);
                    var league = utils.general.findItemInArrBy(leagues, "_id", team.league);
                    var selectedTeam;
                    if (prediction && prediction.team) {
                        selectedTeam = utils.general.findItemInArrBy(clubs, "_id", prediction.team);
                    }
                    var result = utils.general.findItemInArrBy(results, "teamId", teamId);
                    return re(TeamPredictionTile, {
                        team: team,
                        selectedTeam: selectedTeam,
                        league: league,
                        prediction: prediction,
                        predictionCounters: predictionsCounters[teamId] || {},
                        groupConfiguration: groupConfiguration,
                        result: result,
                        key: teamId
                    });
                });

                var groupProps = {className: "tiles-group-title", key: "tilesDeadline" + deadLineIndex};

                tilesInGroup.unshift(re("div", groupProps, "Open until " + deadLineObj.deadline));
                return tilesInGroup;
            });

            tiles = [].concat.apply([], tiles);

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
            predictionsCounters: state.teamsPredictions.predictionsCounters,
            results: state.teamsPredictions.results,
            isShowTileDialog: state.general.isShowTileDialog,
            leagues: state.leagues.leagues,
            selectedLeagueId: state.groups.selectedLeagueId,
            clubs: state.leagues.clubs,
            groups: state.groups.groups,
            selectedGroupId: state.groups.selectedGroupId,
            groupsConfiguration: state.groupsConfiguration.groupsConfiguration
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadTeamsPredictions: function(groupId){dispatch(action.teamsPredictions.loadTeams(groupId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(TeamsPredictionsPage);
})();


