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
				if (arr[4]) {
					matchIds = arr[4].map(function (matchResults) {
						return matchResults.matchId;
					});
				}
				let teamIds = [];
				if (arr[5]) {
					teamIds = arr[5].map(function (teamResults) {
						return teamResults.teamId;
					});
				}
				let gameIds = matchIds.concat(teamIds);
				if (gameIds.length < 1) {
					return Promise.resolve();
				} else {
					return UsersLeaderboardService.updateLeaderboardByGameIds(leagueJson.league._id, gameIds);
				}
			});
		});
	}
};