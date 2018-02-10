window.reducer = window.reducer || {};
reducer.groupsConfiguration = function() {
    var LOAD_GROUP_CONFIGURATION = action.groupsConfiguration.LOAD_GROUP_CONFIGURATION,
        ADD_GROUP_CONFIGURATION = action.groupsConfiguration.ADD_GROUP_CONFIGURATION,
        UPDATE_GROUP_CONFIGURATION = action.groupsConfiguration.UPDATE_GROUP_CONFIGURATION,
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
            case ADD_GROUP_CONFIGURATION:
                return Object.assign({}, state, {groupsConfiguration: utils.general.copyArrAndAdd(state.groupsConfiguration, action.groupConfiguration)});
            case UPDATE_GROUP_CONFIGURATION:
                return Object.assign({}, state, {groupsConfiguration: utils.general.updateOrCreateObject(state.groupsConfiguration, action.groupConfiguration)});
            default:
                return state
        }
    }
}