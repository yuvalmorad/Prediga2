window.action = window.action || {};
action.groups = (function () {
    var groupsAction = {
        LOAD_GROUPS: "LOAD_GROUPS",
        load: load,

        LOAD_ALL_AVAILABLE_GROUPS: "LOAD_ALL_AVAILABLE_GROUPS",
        loadAllAvailableGroups: loadAllAvailableGroups,

        ADD_GROUP: "ADD_GROUP",
        addGroup: addGroup,

        createGroup: createGroup,

        selectGroup: selectGroup,
        SELECT_GROUP: "SELECT_GROUP",

        setSelectedLeagueId: setSelectedLeagueId,
        SET_SELECTED_LEAGUE_ID: "SET_SELECTED_LEAGUE_ID"
    };

    function load() {
        return function(dispatch){
            service.groups.getAll().then(function(res){
                dispatch(success(res));
            }, function(error){

            });
        };

        function success(groups) { return { type: groupsAction.LOAD_GROUPS, groups: groups } }
    }

    function loadAllAvailableGroups() {
        return function(dispatch){
            service.groups.getAllAvailableGroups().then(function(groups){
                dispatch(success(groups));
            }, function(error){

            });
        };

        function success(groups) { return { type: groupsAction.LOAD_ALL_AVAILABLE_GROUPS, groups: groups } }
    }

    function addGroup(group) {
        return {
            type: groupsAction.ADD_GROUP,
            group: group
        }
    }

    function createGroup(group) {
        return function(dispatch){
            service.groups.create(group).then(function(groupCreated){
                var configuration = groupCreated.configuration;
                delete groupCreated.configuration;
                dispatch(action.groupsConfiguration.addGroupConfiguration(configuration));
                dispatch(action.groups.addGroup(groupCreated));

                console.log("success!");
            }, function(error){
                console.log("error!", error);
            });
        };
    }

    function selectGroup(groupId) {
        return {
            type: groupsAction.SELECT_GROUP,
            groupId: groupId
        }
    }

    function setSelectedLeagueId(leagueId) {
        return {
            type: groupsAction.SET_SELECTED_LEAGUE_ID,
            leagueId: leagueId
        }
    }

    return groupsAction;
})();