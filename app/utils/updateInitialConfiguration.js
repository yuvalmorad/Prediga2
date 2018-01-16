const TeamService = require('../services/teamService');
const MatchService = require('../services/matchService');
const MatchResultService = require('../services/matchResultService');
const TeamResultService = require('../services/teamResultService');
const groupConfigurationService = require('../services/groupConfigurationService');
const groupService = require('../services/groupService');
const UsersLeaderboardService = require('../services/usersLeaderboardService');
const UserScoreService = require('../services/userScoreService');
const ClubService = require('../services/clubService');
const LeagueService = require('../services/leagueService');

const self = module.exports = {
	loadAll: function () {
		return Promise.all([
			groupConfigurationService.updateConfiguration(require('../initialData/configuration/groupConfiguration.json').defaultConfiguration),
			groupService.updateGroup(require('../initialData/configuration/groups.json').defaultGroup),
			self.updateLeagueData(require('../initialData/leagues/Tournament_Worldcup_18.json')),
			self.updateLeagueData(require('../initialData/leagues/League_Israel_17-18.json')),
		]).then(function (arr) {
			console.log('Succeed to update all initial data');
			return Promise.resolve();
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
			return Promise.all([
				UserScoreService.updateUserScoreByMatchResults(arr[4], arr[2]),
				UserScoreService.updateUserScoreByTeamResults(arr[5], arr[3])
			]).then(function (arr) {
				let matchIds = [];
				if (arr[0]) {
					matchIds = arr[0][0].map(function (matchResults) {
						return matchResults.gameId;
					});
				}
				let teamIds = [];
				if (arr[1]) {
					teamIds = arr[1][0].map(function (teamResults) {
						return teamResults.gameId;
					});
				}
				let gameIds = matchIds.concat(teamIds);
				let uniqueGameIds = [];
				gameIds.forEach(function (gameId) {
					if (uniqueGameIds.indexOf(gameId) === -1) {
						uniqueGameIds.push(gameId)
					}
				});
				if (uniqueGameIds.length < 1) {
					return Promise.resolve();
				} else {
					return UsersLeaderboardService.updateLeaderboardByGameIds(leagueJson.league._id, uniqueGameIds);
				}
			});
		});
	}
};