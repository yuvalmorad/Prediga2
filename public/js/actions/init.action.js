window.action = window.action || {};
action.init = (function () {
    var initAction = {
        initAll: initAll
    };

    function initAll() {
        return function(dispatch){
            dispatch(action.groups.load());
            dispatch(action.users.loadUsers());
            dispatch(action.leagues.loadLeaguesAndClubs());
            dispatch(action.groupsConfiguration.load());
        }
    }

    return initAction;
})();