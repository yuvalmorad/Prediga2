window.service = window.service || {};
service.leaderBoard = (function() {
    return {
        getAll: getAll,
        getUserMatchPredictions: getUserMatchPredictions,
		getUserTeamPredictions: getUserTeamPredictions,
        getUserStats: getUserStats,
		activateUser: activateUser
    };

    function getAll(groupId) {
        return httpInstnace.get("/api/usersLeaderboard?groupId=" + groupId);
    }

    function getUserMatchPredictions(userId, leagueId, groupId) {
        return httpInstnace.get("/api/userMatchPredictions/matches/" + userId + "?leagueId=" + leagueId + "&groupId=" + groupId);
    }

	function getUserTeamPredictions(userId, leagueId, groupId) {
		return httpInstnace.get("/api/userMatchPredictions/teams/" + userId + "?leagueId=" + leagueId + "&groupId=" + groupId);
	}

    function getUserStats(userId, leagueId, groupId) {
		return httpInstnace.get("/api/userStats?userId=" + userId + "&leagueId=" + leagueId + "&groupId=" + groupId);
    }

    function activateUser(userId, groupId, activate) {
		return httpInstnace.post("/api/usersLeaderboard/" + groupId + "/setActiveUser/" + userId + "/" + (activate ? "true" : "false"));
    }
})();