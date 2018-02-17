window.reducer = window.reducer || {};
reducer.userSettings = function() {
    var LOAD_USER_SETTINGS = action.userSettings.LOAD_USER_SETTINGS;
    var initialState = {
        userSettings: []
    };

    return function userSettings(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_USER_SETTINGS:
                return Object.assign({}, state, {userSettings: action.userSettings});
            default:
                return state
        }
    }
}