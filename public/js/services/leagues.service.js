service.leagues = (function() {
    return {
        getAll: getAll
    };

    function getAll() {
        return httpInstnace.get("/api/leagues");
    }
})();