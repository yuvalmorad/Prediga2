window.service = window.service || {};
service.groupConfiguration = (function() {
    return {
        getGroupConfiguration: getGroupConfiguration
    };

    function getGroupConfiguration() {
        return httpInstnace.get("/api/groupConfiguration").then(function(res){
            return res.data[0];
        });
    }
})();