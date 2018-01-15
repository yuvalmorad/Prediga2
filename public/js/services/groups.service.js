window.service = window.service || {};
service.groups = (function() {
    return {
        getAll: getAll
    };

    function getAll() {
        return httpInstnace.get("/api/group").then(function(res){
            return res.data;
        });
    }
})();