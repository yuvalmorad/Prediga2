const userScoreService = require('../services/userScoreService');

const self = module.exports = {
    getStatsForUser: function (userId, leagueId, groupId) {
        return userScoreService.byUserIdLeagueIdGroupId(userId, leagueId, groupId).then(function (userScores) {
            var stats = {};
            userScores.forEach(function (userScore) {
                if (!stats.hasOwnProperty(userScore.score)) {
                    stats[userScore.score] = 0;
                }
                stats[userScore.score]++;
            });
            stats.total = userScores.length;
            return Promise.resolve(stats);
        });
    }
};