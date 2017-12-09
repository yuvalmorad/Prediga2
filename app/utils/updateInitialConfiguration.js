var TeamService = require('../services/teamService');
var MatchService = require('../services/matchService');
var MatchResultService = require('../services/matchResultService');
var TeamResultService = require('../services/teamResultService');
var PredictionScoreConfigurationService = require('../services/predictionScoreConfigurationService');
var UsersLeaderboardService = require('../services/leaderboardService');
var UserScoreService = require('../services/userScoreService');
var Q = require('q');

var self = module.exports = {
    loadAll: function () {

        var deferred = Q.defer();
        return Promise.all([
            PredictionScoreConfigurationService.updateConfiguration(require('../initialData/scoreConfiguration.json')),
            self.updateLeagueData(require('../initialData/Tournament_Worldcup_18.json')),
            self.updateLeagueData(require('../initialData/League_Israel_17-18.json')),
            //loadGames(require('../initialData/League_Champions_17-18.json'));
        ]).then(function (arr) {
            UserScoreService.updateAllUserScores().then(function (obj) {
                UsersLeaderboardService.updateLeaderboard().then(function (obj) {
                    console.log('Succeed to update all initial data');
                    deferred.resolve(arr);
                });
            });
        });

        return deferred.promise;
    },

    updateLeagueData: function (leagueJson) {
        var deferred = Q.defer();

        return Promise.all([
            MatchService.updateMatches(leagueJson.matches),
            TeamService.updateTeams(leagueJson.teams),
            MatchResultService.updateMatchResults(leagueJson.matchResults),
            TeamResultService.updateTeamResults(leagueJson.teamResults)
        ]).then(function (arr) {
            deferred.resolve(arr);
        });

        return deferred.promise;
    }
};