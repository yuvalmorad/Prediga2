window.service = window.service || {};
service.simulator = (function() {
    return {
        getAll: getAll
    };

    function getAll(groupId) {
        return httpInstnace.get("/api/simulatorUI?groupId=" + groupId);
    }
})();