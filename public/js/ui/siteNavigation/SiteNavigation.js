window.component = window.component || {};
component.SiteNavigation = (function(){
    var connect = ReactRedux.connect,
        NavigationTab = component.NavigationTab,
        withRouter = ReactRouterDOM.withRouter;

    var SiteNavigation = function (props) {
        var league = utils.general.findItemInArrBy(props.leagues, "_id", props.selectedLeagueId);
        var leagueColor = league ? league.color: "";
		var unreadMessagesCount = 0;

		var unreadMessagesCountObj = utils.general.findItemInArrBy(props.unreadMessagesByGroup, "groupId", props.selectedGroupId);
		if (unreadMessagesCountObj) {
			unreadMessagesCount = unreadMessagesCountObj.count;
		}

        var tabs = routePages.getPages().filter(function(page){
            return page.displayInSiteNavigation;
        }).map(function(page, index){
            var indication;
			if (utils.general.cutUrlPath(page.path) === "/groupMessages" && unreadMessagesCount) {
				indication = {
					text: unreadMessagesCount
				}
			}

            return re(NavigationTab, {to: page.path, icon: page.icon, selectedGroupId: props.selectedGroupId, indication: indication, key: index});
        });

        return re("div", { className: "site-navigation" + (props.hide ? " hide" : ""), style: {color: leagueColor, backgroundColor: leagueColor} },
            tabs
        );
    };

    function mapStateToProps(state){
        return {
            selectedLeagueId: state.groups.selectedLeagueId,
            leagues: state.leagues.leagues,
			selectedGroupId: state.groups.selectedGroupId,
			unreadMessagesByGroup: state.groupMessages.unreadMessagesByGroup
        }
    }

    return withRouter(connect(mapStateToProps)(SiteNavigation));
})();


