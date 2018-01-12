window.service = window.service || {};
service.authentication = (function() {
    return {
        isLoggedIn: isLoggedIn,
        logout: logout
    };

    function isLoggedIn() {
        return httpInstnace.get("/auth/isLoggedIn");
    }

    function logout() {
        return httpInstnace.get("/auth/logout");
    }
})();