reducer.groupConfiguration = (function() {
    var LOAD_GROUP_CONFIGURATION = action.groupConfiguration.LOAD_GROUP_CONFIGURATION,
        initialState = {
            groupConfiguration: undefined
        };

    return function groupConfiguration(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_GROUP_CONFIGURATION:
                return Object.assign({}, state, {groupConfiguration: action.groupConfiguration});
            default:
                return state
        }
    }
})();