reducer.authentication = (function() {
    var LOGIN_REQUEST = action.authentication.LOGIN_REQUEST,
        LOGIN_SUCCESS = action.authentication.LOGIN_SUCCESS,
        LOGIN_FAILURE = action.authentication.LOGIN_FAILURE,
        LOGOUT = action.authentication.LOGOUT;

    var user = JSON.parse(localStorage.getItem('user'));
    var initialState = user ? { loggedIn: true, user: user } : {};

    return function authentication(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOGIN_REQUEST:
                return {
                    loggingIn: true,
                    user: action.user
                };
            case LOGIN_SUCCESS:
                return {
                    loggedIn: true,
                    user: action.user
                };
            case LOGIN_FAILURE:
                return {};
            case LOGOUT:
                return {};
            default:
                return state
        }
    }
})();