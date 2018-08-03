const TeamService = require('../services/teamService');
const TeamCategoryService = require('../services/teamCategoryService');
const MatchService = require('../services/matchService');
const MatchResultService = require('../services/matchResultService');
const TeamResultService = require('../services/teamResultService');
const groupConfigurationService = require('../services/groupConfigurationService');
const groupService = require('../services/groupService');
const UsersLeaderboardService = require('../services/usersLeaderboardService');
const UserScoreService = require('../services/userScoreService');
const ClubService = require('../services/clubService');
const LeagueService = require('../services/leagueService');
const utils = require('../utils/util');

const self = module.exports = {
	loadAll: function () {
		return Promise.all([
			groupConfigurationService.updateConfiguration(require('../initialData/configuration/groupConfiguration.json').defaultConfiguration),
			groupService.updateGroup(require('../initialData/configuration/groups.json').defaultGroup),
			self.updateLeagueData(require('../initialData/leagues/18-19/Spain_18-19.json')),
			self.updateLeagueData(require('../initialData/leagues/18-19/England_18-19.json')),
			self.updateLeagueData(require('../initialData/leagues/18-19/Israel_18-19')),
			self.updateLeagueData(require('../initialData/leagues/18-19/Italy_18-19'))
		]).then(function (arr) {
			//console.log('[Init] - Update initial data finished');
			return Promise.resolve({});
		});
	},
	updateLeagueData: function (leagueJson) {
		return Promise.all([
			LeagueService.updateLeague(leagueJson.league),
			ClubService.updateClubs(leagueJson.clubs),
            TeamCategoryService.updateTeamsCategories(leagueJson.teamCategories),
			MatchService.updateMatchesById(leagueJson.matches),
			MatchResultService.updateMatchResults(leagueJson.matchResults),
			TeamService.updateTeams(leagueJson.teams),
			TeamResultService.updateTeamResults(leagueJson.teamResults)
		]).then(function (arr) {
			return Promise.all([
				UserScoreService.updateUserScoreByMatchResults(arr[4], arr[3]),
				UserScoreService.updateUserScoreByTeamResults(arr[6], arr[5])
			]).then(function (userScoreArr) {
				self.conbineUserScoreAndRemoveDuplicates(userScoreArr).then(function (uniqueGameIds) {
					if (uniqueGameIds.length < 1) {
						return Promise.resolve();
					} else {
						return UsersLeaderboardService.updateLeaderboardByGameIds(leagueJson.league._id, uniqueGameIds);
					}
				});
			});
		});
	},
	conbineUserScoreAndRemoveDuplicates: function (userScoreArr) {
		let mergedScores = utils.mergeArr(userScoreArr);
		let mergedScoresIds = UserScoreService.getGameIdArr(mergedScores);
		let uniqueGameIds = [];
		mergedScoresIds.forEach(function (gameId) {
			if (gameId && (typeof (gameId) !== 'undefined') && uniqueGameIds.indexOf(gameId) === -1) {
				uniqueGameIds.push(gameId)
			}
		});
		return Promise.resolve(uniqueGameIds);
	}
};