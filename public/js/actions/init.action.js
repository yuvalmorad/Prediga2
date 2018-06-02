window.action = window.action || {};
action.init = (function () {
    var initAction = {
        initAll: initAll,
        loadPagesContentByGroupId: loadPagesContentByGroupId
    };

    function initAll() {
        return function(dispatch){
            dispatch(action.groups.load());
            dispatch(action.users.loadUsers());
            dispatch(action.leagues.loadLeaguesAndClubs());
            dispatch(action.groupsConfiguration.load());
            dispatch(action.userSettings.load());
            dispatch(action.groupMessages.getUnReadMessages());
        }
    }

    function loadPagesContentByGroupId(groupId) {
		return function(dispatch) {
			dispatch(action.gamesPredictions.loadGames(groupId));
			dispatch(action.teamsPredictions.loadTeams(groupId));
			dispatch(action.leaderBoard.loadLeaderBoard(groupId));
		}
    }

    return initAction;
})();