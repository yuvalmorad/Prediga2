var TeamService = require('../services/teamService');
var MatchService = require('../services/matchService');
var MatchResultService = require('../services/matchResultService');
var TeamResultService = require('../services/teamResultService');
var PredictionScoreConfigurationService = require('../services/predictionScoreConfigurationService');
var UsersLeaderboardService = require('../services/usersLeaderboardService');
var UserScoreService = require('../services/userScoreService');
var MatchResult = require('../models/matchResult');
var TeamResult = require('../models/teamResult');
var Q = require('q');

var self = module.exports = {
    loadAll: function () {
        var deferred = Q.defer();

        self.getCurrentMatchTeamResults().then(function (oldMatchTeamResults) {
            return Promise.all([
                PredictionScoreConfigurationService.updateConfiguration(require('../initialData/scoreConfiguration.json')),
                self.updateLeagueData(require('../initialData/Tournament_Worldcup_18.json')),
                self.updateLeagueData(require('../initialData/League_Israel_17-18.json')),
                //loadGames(require('../initialData/League_Champions_17-18.json'));
            ]).then(function (arr) {
                self.getCurrentMatchTeamResults().then(function (newMatchTeamResults) {
                    UserScoreService.updateAllUserScores().then(function (obj) {
                        UsersLeaderboardService.updateLeaderboard().then(function (obj) {
                            console.log('Succeed to update all initial data');
                            deferred.resolve(arr);
                        });
                    });
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
    },
    getCurrentMatchTeamResults: function () {
        return Promise.all([
            MatchResult.count({}),
            TeamResult.count({})
        ]).then(function (arr) {
            return {
                size: arr[0] + arr[1]
            }
        });
    }
};