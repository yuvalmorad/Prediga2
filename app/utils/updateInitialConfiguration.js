const TeamService = require('../services/teamService');
const MatchService = require('../services/matchService');
const MatchResultService = require('../services/matchResultService');
const TeamResultService = require('../services/teamResultService');
const groupConfigurationService = require('../services/groupConfigurationService');
const UsersLeaderboardService = require('../services/usersLeaderboardService');
const UserScoreService = require('../services/userScoreService');
const ClubService = require('../services/clubService');
const LeagueService = require('../services/leagueService');

const self = module.exports = {
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