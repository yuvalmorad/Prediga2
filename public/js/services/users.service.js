window.service = window.service || {};
service.users = (function() {
    return {
        getAll: getAll,
        getSpecificUsers: getSpecificUsers
    };

    function getAll() {
        return httpInstnace.get("/api/users");
    }

    function getSpecificUsers(usersIds) {
        return httpInstnace.post("/api/users", {ids: usersIds}).then(function(res){
            return res.data
        });
    }
})();