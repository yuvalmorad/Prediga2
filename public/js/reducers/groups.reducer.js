window.reducer = window.reducer || {};
reducer.groups = function() {
    var LOAD_GROUPS = action.groups.LOAD_GROUPS,
        initialState = {
            groups: [],
            selectedGroupId: undefined
        };

    return function groupsConfiguration(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_GROUPS:
                var groups = action.groups;
                return Object.assign({}, state, {groups: groups, selectedGroupId: groups.length ? groups[0]._id : ""});
            default:
                return state
        }
    }
}