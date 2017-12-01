action.authentication = (function () {

    var authentication = {
        LOGIN_REQUEST: "LOGIN_REQUEST",
        LOGIN_SUCCESS: "LOGIN_SUCCESS",
        LOGIN_FAILURE: "LOGIN_FAILURE",
        LOGOUT: "LOGOUT",
        login: login,
        logout: logout
    };

    function login(username, password) {
        return function (dispatch) {
            dispatch(request({username: username}));
            dispatch(action.general.setLoading());

            service.authentication.login(username, password).then(function (user) {
                    dispatch(action.general.removeLoading());
                    dispatch(success(user));
                    routerHistory.push('/');
                }, function (error) {
                    dispatch(action.general.removeLoading());
                    dispatch(failure(error));
                }
            );
        };

        function request(user) {
            return {type: authentication.LOGIN_REQUEST, user: user}
        }

        function success(user) {
            return {type: authentication.LOGIN_SUCCESS, user: user}
        }

        function failure(error) {
            return {type: authentication.LOGIN_FAILURE, error: error}
        }
    }

    function logout() {
        service.authentication.logout();
        return {type: authentication.LOGOUT};
    }

    return authentication

})();