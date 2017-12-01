service.leaderBoard = (function() {
    return {
        getAll: getAll
    };

    function getAll() {
        return httpInstnace.get("/api/usersLeaderboard");
    }
})();