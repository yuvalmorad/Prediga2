window.reducer = window.reducer || {};
reducer.groupsConfiguration = function() {
    var LOAD_GROUP_CONFIGURATION = action.groupsConfiguration.LOAD_GROUP_CONFIGURATION,
        initialState = {
            groupsConfiguration: undefined
        };

    return function groupsConfiguration(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_GROUP_CONFIGURATION:
                return Object.assign({}, state, {groupsConfiguration: action.groupsConfiguration});
            default:
                return state
        }
    }
}