window.component = window.component || {};
component.LeaderBoardPage = (function(){
    var connect = ReactRedux.connect,
        LeaderBoardTiles = component.LeaderBoardTiles,
        LeaguesSubHeader = component.LeaguesSubHeader,
		Search = component.Search;

    var LeaderBoardPage = React.createClass({

		getInitialState: function() {
			return {
				searchName: '',
				sortByStrike: false,
				filterByFavouriteUsers: false
			}
		},

		toggleSortByStrike: function() {
			this.setState({sortByStrike: !this.state.sortByStrike});
		},

		toggleFilterByFavouriteUsers: function() {
			this.setState({filterByFavouriteUsers: !this.state.filterByFavouriteUsers});
		},

		onSearch: function(str) {
			this.setState({searchName: str});
		},

		assignLeaderBoardTilesRef: function(leaderBoardTilesRef) {
			this.leaderBoardTilesRef = leaderBoardTilesRef;
		},

		scrollToMe: function() {
			if (this.leaderBoardTilesRef) {
				this.leaderBoardTilesRef.scrollTo(this.props.userId);
			}
		},

		scrollToTop: function() {
			if (this.leaderBoardTilesRef) {
				this.leaderBoardTilesRef.scrollToTop();
			}
		},

        render: function() {
            var props = this.props,
				state = this.state,
				searchName = state.searchName,
				sortByStrike = state.sortByStrike,
				filterByFavouriteUsers = state.filterByFavouriteUsers,
                selectedLeagueId = props.selectedLeagueId,
                selectedGroupId = props.selectedGroupId,
				groups = props.groups,
                leaders = props.leaders,
                users = props.users,
                userId = props.userId,
				favouriteUsersIds = props.favouriteUsersIds;

            if (!leaders.length || !users.length) {
                return re("div", {className: "content"});
            }

            leaders = utils.general.getLeadersByLeagueId(leaders, selectedLeagueId);

			var group = utils.general.findItemInArrBy(groups, "_id", selectedGroupId);
			var hasMoreThanOneLeague = group && group.leagueIds.length > 1;

            return re("div", { className: "content hasSeach" + (hasMoreThanOneLeague ? " hasSubHeader" : "") },
				hasMoreThanOneLeague && re(LeaguesSubHeader, {}),
				re("div", {className: "leaderboard-controls"},
					re(Search, {onSearch: this.onSearch}),
					re("button", {onClick: this.toggleSortByStrike, className: (sortByStrike ? "selected" : "")}, "Strikes"),
					re("button", {onClick: this.toggleFilterByFavouriteUsers, className: ("prediga-icon" + (filterByFavouriteUsers ? " selected" : ""))}, ""),
					re("button", {onClick: this.scrollToTop}, "#1"),
					re("button", {onClick: this.scrollToMe}, "Me")
				),
                re(LeaderBoardTiles, {ref: this.assignLeaderBoardTilesRef, toggleFavouriteUser: props.toggleFavouriteUser, favouriteUsersIds: favouriteUsersIds, leaders: leaders, users: users, userIdFocus: userId, userId: userId, selectedLeagueId: selectedLeagueId, selectedGroupId: selectedGroupId, searchName: searchName, sortByStrike: sortByStrike, filterByFavouriteUsers: filterByFavouriteUsers})
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
			groups: state.groups.groups,
			favouriteUsersIds: state.leaderBoard.favouriteUsersIds
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
			toggleFavouriteUser: function(userId){dispatch(action.leaderBoard.toggleFavouriteUser(userId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(LeaderBoardPage);
})();


