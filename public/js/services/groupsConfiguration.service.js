window.service = window.service || {};
service.groupsConfiguration = (function() {
    return {
        getGroupsConfiguration: getGroupsConfiguration
    };

    function getGroupsConfiguration() {
        return httpInstnace.get("/api/groupConfiguration").then(function(res){
            return res.data;
        });
    }
})();