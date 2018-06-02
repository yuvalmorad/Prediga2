window.component = window.component || {};
component.SiteNavigation = (function(){
    var connect = ReactRedux.connect,
        NavigationTab = component.NavigationTab,
        withRouter = ReactRouterDOM.withRouter;

    function isAllTeamsUserPredictionFilled(leagueId, teams, userPredictions) {
    	if (!leagueId) {
    		return true;
		}

		var userPredictionsFilled = [];
		var i;
		var team;
		var currentDate = new Date();

		userPredictions.forEach(function(userPrediction) {
			userPredictionsFilled.push(userPrediction.teamId);
		});


    	for (i = 0; i < teams.length; i++) {
			team = teams[i];
			if (currentDate < new Date(team.deadline) && team.league === leagueId) {
				if (userPredictionsFilled.indexOf(team._id) === -1) {
					return false;
				}
			}
		}

		return true;
	}

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
            var cutPath = utils.general.cutUrlPath(page.path);

			if (cutPath === "/groupMessages" && unreadMessagesCount) {
				indication = {
					text: unreadMessagesCount,
					status: "positive"
				};
			} else if (cutPath === "/teamsPredictionsCategories") {
				if (!isAllTeamsUserPredictionFilled(props.selectedLeagueId, props.teams, props.teamsUserPredictions)) {
					indication = {
						text: "!",
						status: "negative"
					};
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
			unreadMessagesByGroup: state.groupMessages.unreadMessagesByGroup,
			teams: state.teamsPredictions.teams,
			teamsUserPredictions: state.teamsPredictions.userPredictions
        }
    }

    return withRouter(connect(mapStateToProps)(SiteNavigation));
})();


