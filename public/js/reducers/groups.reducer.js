window.reducer = window.reducer || {};
reducer.groups = function() {
    var LOAD_GROUPS = action.groups.LOAD_GROUPS,
        LOAD_ALL_AVAILABLE_GROUPS = action.groups.LOAD_ALL_AVAILABLE_GROUPS,
        LOAD_ALL_AVAILABLE_GROUPS_ADMINS = action.groups.LOAD_ALL_AVAILABLE_GROUPS_ADMINS,
        SELECT_GROUP = action.groups.SELECT_GROUP,
        ADD_GROUP = action.groups.ADD_GROUP,
        REMOVE_GROUP = action.groups.REMOVE_GROUP,
        SET_SELECTED_LEAGUE_ID = action.groups.SET_SELECTED_LEAGUE_ID,
        UPDATE_GROUP = action.groups.UPDATE_GROUP,
        LOCAL_STORAGE_SELCTED_GROUP_ID_KEY = "prediga_selected_group_id",
        LOCAL_STORAGE_SELCTED_LEAGUE_ID_BY_GROUP_KEY = "prediga_selected_league_id_by_group",
        initialState = {
            groups: [],
            allAvailableGroups: [],
            allAvailableGroupsAdmins: [],
            selectedGroupId: undefined,
            selectedLeagueId: ""
        };

    function setSelectedGroupIdInLocalStorage(selectedGroupId) {
        localStorage.setItem(LOCAL_STORAGE_SELCTED_GROUP_ID_KEY, selectedGroupId);
    }

    function getSelectedGroupId(groups) {
        var selectedGroupId = localStorage.getItem(LOCAL_STORAGE_SELCTED_GROUP_ID_KEY);

        if (selectedGroupId && utils.general.findItemInArrBy(groups, "_id", selectedGroupId)) {
            //selected key from local storage and exists in groups
            return selectedGroupId
        } else {
            return groups.length ? groups[0]._id : "";
        }
    }

    function setSelectedLeagueIdInLocalStorage(selectedLeagueId, selectedGroupId) {
        var selectedLeagueIdByGroupObj = getSelectedLeagueIdByGroupFromLocalStorage();

        selectedLeagueIdByGroupObj[selectedGroupId] = selectedLeagueId;

        localStorage.setItem(LOCAL_STORAGE_SELCTED_LEAGUE_ID_BY_GROUP_KEY, JSON.stringify(selectedLeagueIdByGroupObj));
    }

    function getSelectedLeagueId(groups, selectedGroupId) {
        var selectedLeagueIdByGroupObj = getSelectedLeagueIdByGroupFromLocalStorage();
        if (selectedLeagueIdByGroupObj[selectedGroupId]) {
            //there was selected league id in this group -> return it
            return selectedLeagueIdByGroupObj[selectedGroupId]
        } else {
            //no selected league id in the past for this group -> get the first one
            var group = utils.general.findItemInArrBy(groups, "_id", selectedGroupId);
            var leagueIds = group.leagueIds;
            return leagueIds.length ? leagueIds[0] : "";
        }
    }

    function getSelectedLeagueIdByGroupFromLocalStorage() {
        var selectedLeagueIdByGroupObj = localStorage.getItem(LOCAL_STORAGE_SELCTED_LEAGUE_ID_BY_GROUP_KEY) || "{}";
        return JSON.parse(selectedLeagueIdByGroupObj);
    }

    function removeGroup(_groups, group) {
        var groups = _groups.slice();
        var groupIndex;
        for (var i = 0; i < groups.length; i++) {
            if (groups[i] === group._id) {
                groupIndex = i;
                break;
            }
        }

        groups.splice(groupIndex, 1);
        return groups;
    }

    return function groupsConfiguration(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_GROUPS:
                var groups = action.groups;
                var selectedGroupId = getSelectedGroupId(groups);
                var selectedLeagueId = getSelectedLeagueId(groups, selectedGroupId);
                return Object.assign({}, state, {groups: groups, selectedGroupId: selectedGroupId, selectedLeagueId: selectedLeagueId});
            case SELECT_GROUP:
                var selectedGroupId = action.groupId;
                setSelectedGroupIdInLocalStorage(selectedGroupId);
                var selectedLeagueId = getSelectedLeagueId(state.groups, selectedGroupId);
                return Object.assign({}, state, {selectedGroupId: selectedGroupId, selectedLeagueId: selectedLeagueId});
            case SET_SELECTED_LEAGUE_ID:
                var selectedLeagueId = action.leagueId;
                setSelectedLeagueIdInLocalStorage(selectedLeagueId, state.selectedGroupId);
                return Object.assign({}, state, {selectedLeagueId: selectedLeagueId});
            case ADD_GROUP:
                return Object.assign({}, state, {groups: utils.general.copyArrAndAdd(state.groups, action.group)});
            case REMOVE_GROUP:
                var groups = removeGroup(state.groups, action.group);
                var selectedGroupId = getSelectedGroupId(groups);
                var selectedLeagueId = getSelectedLeagueId(groups, selectedGroupId);
                return Object.assign({}, state, {groups: groups, selectedGroupId: selectedGroupId, selectedLeagueId: selectedLeagueId});
            case LOAD_ALL_AVAILABLE_GROUPS:
                return Object.assign({}, state, {allAvailableGroups: action.groups});
            case LOAD_ALL_AVAILABLE_GROUPS_ADMINS:
                return Object.assign({}, state, {allAvailableGroupsAdmins: action.admins});
            case UPDATE_GROUP:
                return Object.assign({}, state, {groups: utils.general.updateOrCreateObject(state.groups, action.group)});
            default:
                return state
        }
    }
}