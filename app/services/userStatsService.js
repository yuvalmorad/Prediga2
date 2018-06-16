const matchResultService = require('../services/matchResultService');
const matchPredictionsService = require('../services/matchPredictionsService');
const groupService = require('../services/groupService');
const matchService = require('../services/matchService');
const leagueService = require('../services/leagueService');
const groupConfigurationService = require('../services/groupConfigurationService');
const util = require('../utils/util');

const self = module.exports = {
	getStatsForUser: function (userId, leagueId, groupId) {
		return groupService.byId(groupId).then(function (group) {
			return groupConfigurationService.byId(group.configurationId).then(function (configuration) {
				return leagueService.byId(leagueId).then(function (league) {
					return matchService.byLeagueIds([league._id]).then(function (matches) {
						let matchesIdArr = matchService.getIdArr(matches);
						return Promise.all([
							matchPredictionsService.getPredictionsByUserId({
								userId: userId,
								groupId: groupId,
								leagueId: leagueId,
								isForMe: false,
								matchIds: matchesIdArr
							}),
							matchResultService.byMatchIds(matchesIdArr)
						]).then(function (arr) {
							return self.calculateStats(arr[1], arr[0], configuration);
						});
					});
				})
			});
		});
	},
	calculateStats: function (matchResults, userPredictionsFinished, configuration) {
		var stats = {
			winner: {},
			team1Goals: {},
			team2Goals: {},
			goalDiff: {},
			firstToScore: {},
			prefferedPredictions: {},
			general: {
				totalCount: 0,
				totalScore: 0,
                avgScore: 0
			}
		};

		userPredictionsFinished.forEach(function (userPrediction) {
			const relevantMatchResult = matchResults.find(x => x.matchId.toString() === userPrediction.matchId);
			if (relevantMatchResult) {

				var winnerKey = userPrediction.winner === 'Draw' ? "winnerDraw" : "winner1or2";
				var firstToScoreKey = userPrediction.firstToScore === 'None' ? "firstToScoreNone" : "firstToScore1or2";
				var team1GoalsKey = userPrediction.team1Goals.toString();
				var team2GoalsKey = userPrediction.team2Goals.toString();
				var goalDiffKey = userPrediction.goalDiff.toString();
				let totalScore = 0;
				var scoreWinner = util.calculateResult(userPrediction.winner, relevantMatchResult.winner, configuration.winner);
				totalScore += scoreWinner;
				self.incrementCountAndScore(stats, 'winner', winnerKey, scoreWinner);

				var scoreTeam1Goals = util.calculateResult(userPrediction.team1Goals, relevantMatchResult.team1Goals, configuration.team1Goals);
				totalScore += scoreTeam1Goals;
				self.incrementCountAndScore(stats, 'team1Goals', team1GoalsKey, scoreTeam1Goals);

				var scoreTeam2Goals = util.calculateResult(userPrediction.team2Goals, relevantMatchResult.team2Goals, configuration.team2Goals);
				totalScore += scoreTeam2Goals;
				self.incrementCountAndScore(stats, 'team2Goals', team2GoalsKey, scoreTeam2Goals);

				var scoreGoalDiff = util.calculateResult(userPrediction.goalDiff, relevantMatchResult.goalDiff, configuration.goalDiff);
				totalScore += scoreGoalDiff;
				self.incrementCountAndScore(stats, 'goalDiff', goalDiffKey, scoreGoalDiff);

				var scoreFirstToScore = util.calculateResult(userPrediction.firstToScore, relevantMatchResult.firstToScore, configuration.firstToScore);
				totalScore += scoreFirstToScore;
				self.incrementCountAndScore(stats, 'firstToScore', firstToScoreKey, scoreFirstToScore);

				var prefferedPredictionKey = "" + team1GoalsKey + "-" + goalDiffKey + "-" + team2GoalsKey;
				self.incrementCountAndScore(stats, 'prefferedPredictions', prefferedPredictionKey, totalScore);

				stats.general.totalCount += 1;
				stats.general.totalScore += totalScore;
			}
		});

		// averages calculations:
		self.calculateAverages(stats);
		return Promise.resolve(stats);
	},
	incrementCountAndScore: function (stats, type, value, score) {
		if (!stats[type].hasOwnProperty(value)) {
			stats[type][value] = {
				totalCount: 0,
				totalScore: 0
			}
		}
		stats[type][value].totalCount += 1;
		stats[type][value].totalScore += score;
	},
	calculateAverages: function (stats) {
		stats.general.avgScore = (stats.general.totalScore / stats.general.totalCount).toFixed(2);
		var keys = ['winner', 'team1Goals', 'team2Goals', 'goalDiff', 'firstToScore', 'prefferedPredictions'];
		keys.forEach(function (key) {
			Object.keys(stats[key]).forEach(function (winnerKey) {
				stats[key][winnerKey].avgScore = (stats[key][winnerKey].totalScore / stats[key][winnerKey].totalCount).toFixed(2);
			});
		});
	}
};