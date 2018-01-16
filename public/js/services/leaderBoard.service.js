window.service = window.service || {};
service.leaderBoard = (function() {
    return {
        getAll: getAll,
        getUserMatchPredictions: getUserMatchPredictions
    };

    function getAll(groupId) {
        return httpInstnace.get("/api/usersLeaderboard?groupId=" + groupId);
    }

    function getUserMatchPredictions(userId, leagueId) {
        return httpInstnace.get("/api/userMatchPredictions/" + userId + "?leagueId=" + leagueId);
    }
})();