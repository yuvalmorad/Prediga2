let TeamService = require('../services/teamService');
let MatchService = require('../services/matchService');
let MatchResultService = require('../services/matchResultService');
let TeamResultService = require('../services/teamResultService');
let PredictionScoreConfigurationService = require('../services/predictionScoreConfigurationService');
let UsersLeaderboardService = require('../services/usersLeaderboardService');
let UserScoreService = require('../services/userScoreService');
let Q = require('q');

let self = module.exports = {
    loadAll: function () {
        return Promise.all([
            PredictionScoreConfigurationService.updateConfiguration(require('../initialData/scoreConfiguration.json')),
            self.updateLeagueData(require('../initialData/Tournament_Worldcup_18.json')),
            self.updateLeagueData(require('../initialData/League_Israel_17-18.json')),
            //loadGames(require('../initialData/League_Champions_17-18.json'));
        ]).then(function (arr) {
            UserScoreService.updateAllUserScores().then(function (obj) {
                if (obj.needUpdate === true) {
                    UsersLeaderboardService.updateLeaderboard().then(function (obj) {
                        console.log('Succeed to update all initial data');
                    });
                } else {
                    console.log('Succeed to update all initial data (w/o update leader board)');
                }
            });
        });
    },

    updateLeagueData: function (leagueJson) {
        return Promise.all([
            MatchService.updateMatches(leagueJson.matches),
            TeamService.updateTeams(leagueJson.teams),
            MatchResultService.updateMatchResults(leagueJson.matchResults),
            TeamResultService.updateTeamResults(leagueJson.teamResults)
        ]).then(function (arr) {

        });
    }
};