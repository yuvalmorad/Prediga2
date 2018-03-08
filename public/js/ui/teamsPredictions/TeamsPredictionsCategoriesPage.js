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
                teams.forEach(function(team) {
                    if (team.category === categoryId) {
                        totalPoints += (groupConfiguration ? groupConfiguration[team.type] : 0);
                    }
                });

                return re(TeamPredictionCategoryTile, {categoryName: teamCategory.title, icon: teamCategory.icon, categoryTotalPoints: totalPoints, categoryId: categoryId, key: categoryId});
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


