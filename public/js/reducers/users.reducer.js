reducer.users = (function() {
    var LOAD_USERS = action.users.LOAD_USERS;
    var initialState = {
        users: []
    };

    return function users(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_USERS:
                return Object.assign({}, state, {users: action.users});
            default:
                return state
        }
    }
})();