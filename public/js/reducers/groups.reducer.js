window.reducer = window.reducer || {};
reducer.groups = function() {
    var LOAD_GROUPS = action.groups.LOAD_GROUPS,
        SELECT_GROUP = action.groups.SELECT_GROUP,
        ADD_GROUP = action.groups.ADD_GROUP,
        SET_SELECTED_LEAGUE_ID = action.groups.SET_SELECTED_LEAGUE_ID,
        initialState = {
            groups: [],
            selectedGroupId: undefined,
            selectedLeagueId: ""
        };

    function getSelectedLeagueId(groups, selectedGroupId) {
        var group = utils.general.findItemInArrBy(groups, "_id", selectedGroupId);
        var leagueIds = group.leagueIds;
        return leagueIds.length ? leagueIds[0] : "";
    }

    return function groupsConfiguration(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_GROUPS:
                var groups = action.groups;
                var selectedGroupId = groups.length ? groups[0]._id : "";
                var selectedLeagueId = getSelectedLeagueId(groups, selectedGroupId);
                return Object.assign({}, state, {groups: groups, selectedGroupId: selectedGroupId, selectedLeagueId: selectedLeagueId});
            case SELECT_GROUP:
                var selectedGroupId = action.groupId;
                var selectedLeagueId = getSelectedLeagueId(state.groups, selectedGroupId);
                return Object.assign({}, state, {selectedGroupId: selectedGroupId, selectedLeagueId: selectedLeagueId});
            case SET_SELECTED_LEAGUE_ID:
                return Object.assign({}, state, {selectedLeagueId: action.leagueId});
            case ADD_GROUP:
                return Object.assign({}, state, {groups: utils.general.copyArrAndAdd(state.groups, action.group)});
            default:
                return state
        }
    }
}