window.service = window.service || {};
service.leaderBoard = (function() {
    return {
        getAll: getAll,
        getUserMatchPredictions: getUserMatchPredictions
    };

    function getAll() {
        return httpInstnace.get("/api/usersLeaderboard");
    }

    function getUserMatchPredictions(userId, leagueId) {
        return httpInstnace.get("/api/userMatchPredictions/" + userId + "?leagueId=" + leagueId);
    }
})();