const UserScore = require('../models/userScore');
const matchPredictionsService = require('../services/matchPredictionsService');
const teamPredictionsService = require('../services/teamPredictionsService');
const groupConfigurationService = require('../services/groupConfigurationService');
const groupService = require('../services/groupService');
const util = require('../utils/util');

const self = module.exports = {
	updateUserScoreByMatchResults: function (matchResults, matches) {
		if (!matchResults || matchResults.length < 1) {
			return Promise.resolve([]);
		}
		//console.log('beginning to update user scores based on ' + matchResults.length + ' matchResults');
		const promises = matchResults.map(function (aMatchResult) {
			const relevantMatch = matches.find(x => x._id.toString() === aMatchResult.matchId);
			if (!relevantMatch) {
				return Promise.resolve([]);
			}
			const leagueId = relevantMatch.league;
			return self.updateUserScoreByMatchResult(aMatchResult, leagueId);
		});
		return Promise.all(promises);
	},
	updateUserScoreByMatchResult: function (matchResult, leagueId) {
		return matchPredictionsService.byMatchId(matchResult.matchId).then(function (matchPredictions) {
			if (!matchPredictions) {
				return Promise.resolve([]);
			}
			const groupIds = matchPredictionsService.getGroupIdArr(matchPredictions);
			return groupService.byIds(groupIds).then(function (groups) {
				const groupConfigurationIds = groupService.getConfigurationIdMap(groups);
				return groupConfigurationService.byIds(groupConfigurationIds).then(function (configurations) {
					return self.updateUserScoreByMatchResultAndUserPredictions(matchResult, matchPredictions, groups, configurations, leagueId);
				});
			});
		});
	},
	updateUserScoreByMatchResultAndUserPredictions: function (matchResult, matchPredictions, groups, configurations, leagueId) {
		//console.log('found ' + anUserMatchPredictions.length + ' user MatchPredictions');
		const promises = matchPredictions.map(function (userPrediction) {
			let groupRelevant = groupService.filterByGroupId(groups, userPrediction.groupId);
			if (!groupRelevant || groupRelevant.length < 1) {
				return Promise.resolve({});
			}
			let groupConfigurationsRelevant = groupConfigurationService.filterById(configurations, groupRelevant[0].configurationId);
			if (!groupConfigurationsRelevant || groupConfigurationsRelevant.length < 1) {
				return Promise.resolve({});
			}

			// calculate score for user
			const score = self.calculateUserPredictionScore(userPrediction, matchResult, groupConfigurationsRelevant[0]);
			const isStrikeCount = self.isScoreAStrike(score, groupConfigurationsRelevant[0]);

			// score to update
			return self.updateScore({
				groupId: userPrediction.groupId,
				leagueId: leagueId,
				userId: userPrediction.userId,
				gameId: userPrediction.matchId,
				score: score,
				strikes: isStrikeCount ? 1 : 0
			});
		});
		return Promise.all(promises);
	},
	updateUserScoreByTeamResults: function (teamResults, teams) {
		if (!teamResults || teamResults.length < 1) {
			return Promise.resolve([]);
		}
		//console.log('beginning to update user scores based on ' + teamResults.length + ' teamResults');
		// for each team result, get all teamPredictions
		const promises = teamResults.map(function (aTeamResult) {
			const relevantTeam = teams.find(x => x._id.toString() === aTeamResult.teamId);
			if (!relevantTeam) {
				return Promise.resolve([]);
			}
			const leagueId = relevantTeam.league;
			return self.updateUserScoreByTeamResult(aTeamResult, leagueId);
		});
		return Promise.all(promises);
	},
	updateUserScoreByTeamResult: function (teamResult, leagueId) {
		return teamPredictionsService.byTeamId(teamResult.teamId).then(function (teamPredictions) {
			if (!teamPredictions) {
				return Promise.resolve({});
			}
			const groupIds = teamPredictionsService.getGroupIdArr(teamPredictions);

			return groupService.byIds(groupIds).then(function (groups) {
				const groupConfigurationIds = groupService.getConfigurationIdMap(groups);
				return groupConfigurationService.byIds(groupConfigurationIds).then(function (configurations) {
					return self.updateUserScoreByTeamResultAndUserPredictions(teamResult, teamPredictions, groups, configurations, leagueId);
				});
			});
		});
	},
	updateUserScoreByTeamResultAndUserPredictions: function (teamResult, teamPredictions, groups, configurations, leagueId) {
		//console.log('found ' + anUserTeamPredictions.length + ' user MatchPredictions');
		const promises = teamPredictions.map(function (userPrediction) {
			let groupRelevant = groupService.filterByGroupId(groups, userPrediction.groupId);
			if (!groupRelevant || groupRelevant.length < 1) {
				return Promise.resolve({});
			}
			let groupConfigurationsRelevant = groupConfigurationService.filterById(configurations, groupRelevant[0].configurationId);
			if (!groupConfigurationsRelevant || groupConfigurationsRelevant.length < 1) {
				return Promise.resolve({});
			}

			let score = 0;
			const configScore = self.convertTeamTypeToConfigScore(teamResult.type, groupConfigurationsRelevant[0]);
			score += util.calculateResult(userPrediction.team, teamResult.team, configScore);
			return self.updateScore({
				groupId: userPrediction.groupId,
				leagueId: leagueId,
				userId: userPrediction.userId,
				gameId: userPrediction.teamId,
				score: score,
				strikes: 0
			});
		});
		return Promise.all(promises);
	},
	calculateUserPredictionScore: function (userPrediction, matchResult, configuration) {
		let score = 0;
		score += util.calculateResult(userPrediction.winner, matchResult.winner, configuration.winner);
		score += util.calculateResult(userPrediction.team1Goals, matchResult.team1Goals, configuration.team1Goals);
		score += util.calculateResult(userPrediction.team2Goals, matchResult.team2Goals, configuration.team2Goals);
		score += util.calculateResult(userPrediction.goalDiff, matchResult.goalDiff, configuration.goalDiff);
		score += util.calculateResult(userPrediction.firstToScore, matchResult.firstToScore, configuration.firstToScore);
		return score;
	},
	isScoreAStrike: function (score, configuration) {
		const maxScore = (configuration.winner + configuration.team1Goals + configuration.team2Goals + configuration.goalDiff + configuration.firstToScore);
		return (score === maxScore);
	},
	convertTeamTypeToConfigScore: function (type, configuration) {
		if (!type) {
			return configuration.teamInGroup;
		} else if (type === '1st') {
			return configuration.teamWinner;
		} else if (type === '2nd') {
			return configuration.teamRunnerUp;
		} else if (type === '3rd') {
			return configuration.teamThird;
		} else if (type === '4th') {
			return configuration.teamForth;
		} else if (type === '14th') {
			return configuration.teamLast;
		} else if (type === '13th') {
			return configuration.team2ndLast;
		} else {
			return configuration.teamInGroup;
		}
	},
	updateScore: function (userScore) {
		return UserScore.findOneAndUpdate({
			groupId: userScore.groupId, userId: userScore.userId, gameId: userScore.gameId, leagueId: userScore.leagueId
		}, userScore, util.updateSettings).then(function (newUserScore) {
				return Promise.resolve(newUserScore);
			}
		);
	},
	all: function () {
		return UserScore.find({});
	},
	removeByGroupId: function (groupId) {
		return UserScore.remove({groupId: groupId});
	},
	removeByGroupIdAndUserId: function (groupId, userId) {
		return UserScore.remove({groupId: groupId, userId: userId});
	},
	byLeagueIdGameIdGroupId: function (leagueId, gameId, groupId) {
		return UserScore.find({
			leagueId: leagueId, gameId: gameId, groupId: groupId
		});
	},
	getGameIdArr: function (userScores) {
		if (userScores) {
			return userScores.map(function (userScore) {
				return userScore.gameId;
			});
		} else {
			return Promise.resolve([]);
		}
	}
};