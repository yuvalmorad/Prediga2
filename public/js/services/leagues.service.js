window.service = window.service || {};
service.leagues = (function() {
    return {
        getAll: getAll,
        getAllAvailableLeagues: getAllAvailableLeagues
    };

    function getAll() {
        return httpInstnace.get("/api/leagues");
    }

    function getAllAvailableLeagues() {
        return httpInstnace.get("/api/leagues/allLeagues").then(function(res){
            return res.data;
        });
    }
})();