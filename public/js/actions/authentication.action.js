action.authentication = (function(){

    var authentication = {
        LOGIN_REQUEST: "LOGIN_REQUEST",
        LOGIN_SUCCESS: "LOGIN_SUCCESS",
        LOGIN_FAILURE: "LOGIN_FAILURE",
        LOGOUT: "LOGOUT",
        REGISTER_REQUEST: "REGISTER_REQUEST",
        REGISTER_SUCCESS: "REGISTER_SUCCESS",
        REGISTER_FAILURE: "REGISTER_FAILURE",
        login: login,
        logout: logout,
        register: register
    };

    function login(username, password) {
        return function(dispatch) {
            dispatch(request({ username: username }));
            dispatch(action.general.setLoading());

            service.authentication.login(username, password).
                then(function(user){
                    dispatch(action.general.removeLoading());
                    dispatch(success(user));
                    routerHistory.push('/');
                }, function(error){
                    dispatch(action.general.removeLoading());
                    dispatch(failure(error));
                }
            );
        };

        function request(user) { return { type: authentication.LOGIN_REQUEST, user: user } }
        function success(user) { return { type: authentication.LOGIN_SUCCESS, user: user } }
        function failure(error) { return { type: authentication.LOGIN_FAILURE, error: error } }
    }

    function logout() {
        service.authentication.logout();
        return { type: authentication.LOGOUT };
    }

    function register(user) {
        return function(dispatch) {
            dispatch(action.general.setLoading());
            dispatch(request(user));

            service.authentication.register(user).
                then(function(user){
                    dispatch(action.general.removeLoading());
                    dispatch(success());
                    routerHistory.push('/login');
                }, function(error){
                    dispatch(action.general.removeLoading());
                    dispatch(failure(error));
                }
            );
        };

        function request(user) { return { type: authentication.REGISTER_REQUEST, user: user } }
        function success(user) { return { type: authentication.REGISTER_SUCCESS, user: user } }
        function failure(error) { return { type: authentication.REGISTER_FAILURE, error: error } }
    }

    return authentication

})();