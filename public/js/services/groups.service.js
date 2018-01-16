window.service = window.service || {};
service.groups = (function() {
    return {
        getAll: getAll,
        getAllAvailableGroups: getAllAvailableGroups,
        create: create,
        joinGroup: joinGroup,
        kickUser: kickUser,
        unregister: unregister
    };

    function getAll() {
        return httpInstnace.get("/api/group").then(function(res){
            return res.data;
        });
    }

    function getAllAvailableGroups() {
        return httpInstnace.get("/api/group/allGroups").then(function(res){
            return res.data;
        });
    }

    function create(group) {
        return httpInstnace.post("/api/group", group).then(function(res){
            return res.data
        });
    }

    function joinGroup(groupId, secret) {
        return httpInstnace.post("/api/group/" + groupId + "/register?secret=" + secret);
    }

    function kickUser(groupId, userId) {
        return httpInstnace.delete("/api/group/" + groupId + "/kick?userId=" + userId);
    }

    function unregister(groupId) {
        return httpInstnace.delete("/api/group/" + groupId + "/unregister");
    }
})();