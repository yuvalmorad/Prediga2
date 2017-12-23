let TeamService = require('../services/teamService');
let MatchService = require('../services/matchService');
let MatchResultService = require('../services/matchResultService');
let TeamResultService = require('../services/teamResultService');
let groupConfigurationService = require('../services/groupConfigurationService');
let UsersLeaderboardService = require('../services/usersLeaderboardService');
let UserScoreService = require('../services/userScoreService');
let ClubService = require('../services/clubService');
let LeagueService = require('../services/leagueService');

let self = module.exports = {
    loadAll: function () {
        return Promise.all([
            groupConfigurationService.updateConfiguration(require('../initialData/configuration/groupConfiguration.json')),
            self.updateLeagueData(require('../initialData/leagues/Tournament_Worldcup_18.json')),
            self.updateLeagueData(require('../initialData/leagues/League_Israel_17-18.json')),
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
            LeagueService.updateLeague(leagueJson.league),
            ClubService.updateClubs(leagueJson.clubs),
            MatchService.updateMatches(leagueJson.matches),
            TeamService.updateTeams(leagueJson.teams),
            MatchResultService.updateMatchResults(leagueJson.matchResults),
            TeamResultService.updateTeamResults(leagueJson.teamResults)
        ]).then(function (arr) {
            console.log('update league data finished');
        });
    }
};