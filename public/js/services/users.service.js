window.service = window.service || {};
service.users = (function() {
    return {
        getAll: getAll
    };

    function getAll() {
        return httpInstnace.get("/api/users");
    }
})();