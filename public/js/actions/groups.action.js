window.action = window.action || {};
action.groups = (function () {
    var groupsAction = {
        LOAD_GROUPS: "LOAD_GROUPS",
        load: load,

        LOAD_ALL_AVAILABLE_GROUPS: "LOAD_ALL_AVAILABLE_GROUPS",
        LOAD_ALL_AVAILABLE_GROUPS_ADMINS: "LOAD_ALL_AVAILABLE_GROUPS_ADMINS",
        loadAllAvailableGroups: loadAllAvailableGroups,

        ADD_GROUP: "ADD_GROUP",
        addGroup: addGroup,

        REMOVE_GROUP: "REMOVE_GROUP",
        removeGroup: removeGroup,

        createGroup: createGroup,
        updateGroupConfiguration: updateGroupConfiguration,

        selectGroup: selectGroup,
        SELECT_GROUP: "SELECT_GROUP",

        setSelectedLeagueId: setSelectedLeagueId,
        SET_SELECTED_LEAGUE_ID: "SET_SELECTED_LEAGUE_ID",

        updateGroup: updateGroup,
        UPDATE_GROUP: "UPDATE_GROUP"
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
                dispatch(successAllAvailableGroups(groups));
                var usersAdmins = groups.map(function(group){
                    return group.createdBy;
                });
                service.users.getSpecificUsers(usersAdmins).then(function(admins){
                    dispatch(successAllAvailableGroupsAdmins(admins));
                })
            }, function(error){

            });
        };

        function successAllAvailableGroups(groups) { return { type: groupsAction.LOAD_ALL_AVAILABLE_GROUPS, groups: groups } }
        function successAllAvailableGroupsAdmins(admins) { return { type: groupsAction.LOAD_ALL_AVAILABLE_GROUPS_ADMINS, admins: admins } }
    }

    function addGroup(group) {
        return {
            type: groupsAction.ADD_GROUP,
            group: group
        }
    }

    function removeGroup(group) {
        return {
            type: groupsAction.REMOVE_GROUP,
            group: group
        }
    }

    //TODO merge create and update group to one function

    function createGroup(group) {
        return function(dispatch){
            service.groups.createOrUpdate(group).then(function(groupCreated){
                var configuration = groupCreated.configuration;
                delete groupCreated.configuration;
                dispatch(action.groupsConfiguration.addGroupConfiguration(configuration));
                dispatch(action.groups.addGroup(groupCreated));
                dispatch(action.groups.loadAllAvailableGroups());
            }, function(error){
				alert("Internal Error! please refresh the browser.");
            });
        };
    }

    function updateGroupConfiguration(group) {
        return function(dispatch){
            service.groups.createOrUpdate(group).then(function(groupCreated){
                var configuration = groupCreated.configuration;
                delete groupCreated.configuration;
                dispatch(action.groupsConfiguration.updateGroupConfiguration(configuration));
                dispatch(action.groups.updateGroup(groupCreated));
            }, function(error){
				alert("Internal Error! please refresh the browser.");
            });
        };
    }

    function selectGroup(groupId) {
		return function(dispatch){
			dispatch(action.init.loadPagesContentByGroupId(groupId));
			dispatch({
                type: groupsAction.SELECT_GROUP,
                groupId: groupId
            });
		};
    }

    function setSelectedLeagueId(leagueId) {
        return {
            type: groupsAction.SET_SELECTED_LEAGUE_ID,
            leagueId: leagueId
        }
    }

    function updateGroup(group) {
        return {
            type: groupsAction.UPDATE_GROUP,
            group: group
        }
    }

    return groupsAction;
})();