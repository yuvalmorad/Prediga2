service.authentication = (function () {
    return {
        login: login,
        logout: logout
    };

    function login() {
        return httpInstnace.get("/auth/facebook", {}).then(function (oResult) {
            localStorage.setItem('user', oResult);
        });
    }

    function logout() {
        return httpInstnace.get("/logout", {}).then(function (oResult) {
            localStorage.removeItem('user');
        });
    }
})();