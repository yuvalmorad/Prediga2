service.authentication = (function() {
    return {
        logout: logout
    };

    function logout() {
        return httpInstnace.get("/auth/logout");
    }
})();