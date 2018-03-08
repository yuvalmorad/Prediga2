window.component = window.component || {};
component.TeamsPredictionsCategoriesPage = (function(){
    var connect = ReactRedux.connect,
        TeamPredictionCategoryTile = component.TeamPredictionCategoryTile,
        LeaguesSubHeader = component.LeaguesSubHeader;

    var TeamsPredictionsPage = React.createClass({
        getInitialState: function() {
            var groupId = this.props.selectedGroupId;
            if (groupId && this.props.loadedSuccessGroupId !== groupId) {
                this.props.loadTeamsPredictions(groupId);
            }

            return {};
        },

        componentWillReceiveProps: function(nextProps) {
            if (nextProps.selectedGroupId !== this.props.selectedGroupId) {
                //changed group selection -> load matches of selected group id
                this.props.loadTeamsPredictions(nextProps.selectedGroupId);
            }
        },

        render: function() {
            var props = this.props,
                teams = props.teams,
                results = props.results,
                userPredictions = props.userPredictions,
                teamCategories = props.teamCategories,
                selectedLeagueId = props.selectedLeagueId,
                groups = props.groups,
                selectedGroupId = props.selectedGroupId,
                groupsConfiguration = props.groupsConfiguration || [];

            //filter teams categories with selected league id
            teamCategories = teamCategories.filter(function(teamCategory){
                return teamCategory.league === selectedLeagueId;
            });

            var groupConfiguration = utils.general.getGroupConfiguration(groups, selectedGroupId, groupsConfiguration);

            var tiles = teamCategories.map(function(teamCategory){
                var categoryId = teamCategory._id;
                var totalPoints = 0;
                var totalPointsEarned; //if undefined than no results
                var deadline;
                var resultTime;

                //sum total points of all teams and get the deadline + resultTime of the first team (all should be the same)
                teams.forEach(function(team) {
                    if (team.category === categoryId) {
                        var teamId = team._id;
                        var points = (groupConfiguration ? groupConfiguration[team.type] : 0);
                        totalPoints += points;
                        if (!deadline) {
                            deadline = team.deadline;
                            resultTime = team.resultTime;
                        }

                        var result = utils.general.findItemInArrBy(results, "teamId", teamId);
                        var prediction = utils.general.findItemInArrBy(userPredictions, "teamId", teamId);
                        if (result) {
                            if (!totalPointsEarned) {
                                totalPointsEarned = 0;
                            }

                            if (prediction && prediction.team === result.team) {
                                totalPointsEarned += points;
                            }
                        }

                    }
                });

                return re(TeamPredictionCategoryTile, {categoryName: teamCategory.title, icon: teamCategory.icon, deadline: deadline, resultTime: resultTime, categoryTotalPointsEarned: totalPointsEarned , categoryTotalPoints: totalPoints, categoryId: categoryId, key: categoryId});
            });

            return re("div", { className: "content hasSubHeader" },
                re(LeaguesSubHeader, {}),
                re("div", {className: "tiles"},
                    tiles
                )
            );
        }
    });

    function mapStateToProps(state){
        return {
            teams: state.teamsPredictions.teams,
            loadedSuccessGroupId: state.teamsPredictions.loadedSuccessGroupId,
            teamCategories: state.teamsPredictions.teamCategories,
            results: state.teamsPredictions.results,
            userPredictions: state.teamsPredictions.userPredictions,
            selectedLeagueId: state.groups.selectedLeagueId,
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


