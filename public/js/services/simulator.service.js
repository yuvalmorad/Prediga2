window.service = window.service || {};
service.simulator = (function() {
    return {
        getAll: getAll
    };

    function getAll() {
        return httpInstnace.get("/api/simulatorUI");
    }
})();