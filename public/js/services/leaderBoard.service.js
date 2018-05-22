window.service = window.service || {};
service.leaderBoard = (function() {
    return {
        getAll: getAll,
        getUserMatchPredictions: getUserMatchPredictions,
		activateUser: activateUser
    };

    function getAll(groupId) {
        return httpInstnace.get("/api/usersLeaderboard?groupId=" + groupId);
    }

    function getUserMatchPredictions(userId, leagueId, groupId) {
        return httpInstnace.get("/api/userMatchPredictions/" + userId + "?leagueId=" + leagueId + "&groupId=" + groupId);
    }

    function activateUser(userId, groupId, activate) {
		return httpInstnace.post("/api/usersLeaderboard/" + groupId + "/setActiveUser/" + userId + "/" + (activate ? "true" : "false"));
    }
})();