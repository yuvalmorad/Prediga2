window.component = window.component || {};
component.LeaderBoardDetails = (function(){
	var LeaderBoardMatchesHistory = component.LeaderBoardMatchesHistory;
	var LeaderBoardTeamsHistory = component.LeaderBoardTeamsHistory;
	var LeaderBoardStats = component.LeaderBoardStats;

    return React.createClass({
        getInitialState: function() {
            return {
                selectedTabId: 0
            }
        },

        onTabSelectionChange: function(tabId, event) {
			event.stopPropagation();
            this.setState({selectedTabId: tabId});
        },

        render: function() {
			var that = this,
                props = this.props,
                state = this.state,
                userId = props.userId,
				selectedTabId = state.selectedTabId,
                selectedComponentElem,
                tabs = [
                    {
						name: "Matches",
						id: 0,
						component: LeaderBoardMatchesHistory,
						componentProps: {userId: userId}
					},
					{
						name: "Teams",
						id: 1,
						component: LeaderBoardTeamsHistory,
						componentProps: {userId: userId}
					},
					{
						name: "Stats",
                        id: 2,
                        component: LeaderBoardStats,
						componentProps: {userId: userId}
					}
                ];

			var tabsElems = tabs.map(function(tab){
			    var isSelectedTab = selectedTabId === tab.id;
			    if (isSelectedTab) {
					selectedComponentElem = re(tab.component, tab.componentProps);
				}
			    return re("div", {
			        className: "leaderboard-details-item" + (isSelectedTab ? " selected" : ""),
                    onClick: that.onTabSelectionChange.bind(that, tab.id),
                    key: tab.id}, tab.name);
            });

            return re("div", {className: "leaderboard-details"},
                re("div", {className: "leaderboard-details-header"},
					tabsElems
                ),
				selectedComponentElem
            );
        }
    });
})();


