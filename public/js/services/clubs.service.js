service.clubs = (function() {
    return {
        getAll: getAll
    };

    function getAll() {
        return httpInstnace.get("/api/clubs");
    }
})();