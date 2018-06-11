window.component = window.component || {};
component.LeaderBoardPage = (function(){
    var connect = ReactRedux.connect,
        LeaderBoardTiles = component.LeaderBoardTiles,
        LeaguesSubHeader = component.LeaguesSubHeader,
		Search = component.Search;

    var LeaderBoardPage = React.createClass({

		getInitialState: function() {
			return {
				searchName: ''
			}
		},

		onSearch: function(str) {
			this.setState({searchName: str});
		},

        render: function() {
            var props = this.props,
				state = this.state,
				searchName = state.searchName,
                selectedLeagueId = props.selectedLeagueId,
                selectedGroupId = props.selectedGroupId,
				groups = props.groups,
                leaders = props.leaders,
                users = props.users,
                userId = props.userId;

            if (!leaders.length || !users.length) {
                return re("div", {className: "content"});
            }

            leaders = utils.general.getLeadersByLeagueId(leaders, selectedLeagueId);

			var group = utils.general.findItemInArrBy(groups, "_id", selectedGroupId);
			var hasMoreThanOneLeague = group && group.leagueIds.length > 1;

            return re("div", { className: "content hasSeach" + (hasMoreThanOneLeague ? " hasSubHeader" : "") },
				hasMoreThanOneLeague && re(LeaguesSubHeader, {}),
				re(Search, {onSearch: this.onSearch}),
                re(LeaderBoardTiles, {leaders: leaders, users: users, userId: userId, selectedLeagueId: selectedLeagueId, selectedGroupId: selectedGroupId, searchName: searchName})
            );
        }
    });

    function mapStateToProps(state){
        return {
            leaders: state.leaderBoard.leaders,
            leadersStatus: state.leaderBoard.status,
            users: state.users.users,
            selectedLeagueId: state.groups.selectedLeagueId,
            userId: state.authentication.userId,
            selectedGroupId: state.groups.selectedGroupId,
			groups: state.groups.groups
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(LeaderBoardPage);
})();


