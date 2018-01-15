window.service = window.service || {};
service.groups = (function() {
    return {
        getAll: getAll,
        create: create
    };

    function getAll() {
        return httpInstnace.get("/api/group").then(function(res){
            return res.data;
        });
    }

    function create(group) {
        return httpInstnace.post("/api/group", group).then(function(res){
            return res.data
        });
    }
})();