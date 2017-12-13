service.leaderBoard = (function() {
    return {
        getAll: getAll,
        getUserMatchPredictions: getUserMatchPredictions
    };

    function getAll() {
        return httpInstnace.get("/api/usersLeaderboard");
    }

    function getUserMatchPredictions(userId) {
        return httpInstnace.get("/api/userMatchPredictions/" + userId);
    }
})();