window.reducer = window.reducer || {};
reducer.authentication = (function() {
    var SET_USER_ID = action.authentication.SET_USER_ID;
    var initialState = {
        userId: ""
    };

    return function authentication(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case SET_USER_ID:
                return {
                    userId: action.userId
                };
            default:
                return state
        }
    }
})();