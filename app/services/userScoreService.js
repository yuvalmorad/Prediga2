const Q = require('q');
const UserScore = require('../models/userScore');
const MatchPrediction = require('../models/matchPrediction');
const TeamPrediction = require('../models/teamPrediction');
const GroupConfiguration = require('../models/groupConfiguration');
const Group = require('../models/group');
const util = require('../utils/util');

const self = module.exports = {
	updateUserScoreByMatchResults: function (matchResults, matches) {
		if (!matchResults || matchResults.length === 0) {
			return;
		}
		console.log('beginning to update user scores based on ' + matchResults.length + ' matchResults');
		const promises = matchResults.map(function (aMatchResult) {
			const relevantMatch = matches.find(x => x._id.toString() === aMatchResult.matchId);
			if (relevantMatch) {
				const leagueId = relevantMatch.league;
				return self.updateUserScoreByMatchResult(aMatchResult, leagueId);
			} else {
				return Promise.resolve([]);
			}
		});
		return Promise.all(promises);
	},
	updateUserScoreByMatchResult: function (matchResult, leagueId) {
		return Promise.all([
			MatchPrediction.find({matchId: matchResult.matchId})
		]).then(function (arr) {
			if (arr[0]) {
				let matchPredictions = arr[0];
				const groupIds = matchPredictions.map(function (matchPrediction) {
					return matchPrediction.groupId;
				});
				return Promise.all([
					Group.find({_id: {$in: groupIds}})
				]).then(function (arr1) {
					let groups = arr1[0];
					const groupConfigurationIds = groups.map(function (group) {
						return group.configurationId;
					});
					return Promise.all([
						GroupConfiguration.find({_id: {$in: groupConfigurationIds}})
					]).then(function (arr2) {
						let groupConfigurations = arr2[0];
						return self.updateUserScoreByMatchResultAndUserPredictions(matchResult, matchPredictions, groups, groupConfigurations, leagueId);
					});
				});
			} else {
				return [];
			}
		});
	},
	updateUserScoreByMatchResultAndUserPredictions: function (matchResult, matchPredictions, groups, groupConfigurations, leagueId) {
		//console.log('found ' + anUserMatchPredictions.length + ' user MatchPredictions');
		const promises = matchPredictions.map(function (userPrediction) {
			let groupRelevant = groups.filter(function (group) {
				return group._id.toString() === userPrediction.groupId;
			});
			if (!groupRelevant || groupRelevant.length < 1) {
				return;
			}

			let groupConfigurationsRelevant = groupConfigurations.filter(function (groupConfiguration) {
				return groupConfiguration._id.toString() === groupRelevant[0].configurationId;
			});

			if (!groupConfigurationsRelevant || groupConfigurationsRelevant.length < 1) {
				return;
			}

			// calculate score for user
			const score = self.calculateUserPredictionScore(userPrediction, matchResult, groupConfigurationsRelevant[0]);
			const isStrikeCount = self.isScoreIsStrike(score, groupConfigurationsRelevant[0]);

			// score to update
			const userScore = {
				groupId: userPrediction.groupId,
				leagueId: leagueId,
				userId: userPrediction.userId,
				gameId: userPrediction.matchId,
				score: score,
				strikes: isStrikeCount ? 1 : 0
			};

			return self.updateScore(userScore);
		});
		return Promise.all(promises);
	},
	updateUserScoreByTeamResults: function (teamResults, teams) {
		if (!teamResults || teamResults.length === 0) {
			return;
		}
		console.log('beginning to update user scores based on ' + teamResults.length + ' teamResults');
		// for each team result, get all teamPredictions
		const promises = teamResults.map(function (aTeamResult) {
			const relevantTeam = teams.find(x => x._id.toString() === aTeamResult.teamId);
			if (relevantTeam) {
				const leagueId = relevantTeam.league;
				return self.updateUserScoreByTeamResult(aTeamResult, leagueId);
			} else {
				return Promise.resolve();
			}
		});
		return Promise.all(promises);
	},
	updateUserScoreByTeamResult: function (teamResult, leagueId) {
		return Promise.all([
			TeamPrediction.find({teamId: teamResult.teamId})
		]).then(function (arr) {
			if (arr[0]) {
				let teamPredictions = arr[0];
				const groupIds = teamPredictions.map(function (teamPrediction) {
					return teamPrediction.groupId;
				});
				return Promise.all([
					Group.find({_id: {$in: groupIds}})
				]).then(function (arr1) {
					let groups = arr1[0];
					const groupConfigurationIds = groups.map(function (group) {
						return group.configurationId;
					});
					return Promise.all([
						GroupConfiguration.find({_id: {$in: groupConfigurationIds}})
					]).then(function (arr2) {
						let groupConfigurations = arr2[0];
						return self.updateUserScoreByTeamResultAndUserPredictions(teamResult, teamPredictions, groups, groupConfigurations, leagueId);
					});
				});
			} else {
				return {};
			}
		});
	},
	updateUserScoreByTeamResultAndUserPredictions: function (teamResult, teamPredictions, groups, groupConfigurations, leagueId) {
		//console.log('found ' + anUserTeamPredictions.length + ' user MatchPredictions');
		const promises = teamPredictions.map(function (userPrediction) {
			let groupRelevant = groups.filter(function (group) {
				return group._id === userPrediction.groupId;
			});
			if (!groupRelevant || groupRelevant.length < 1) {
				return;
			}

			let groupConfigurationsRelevant = groupConfigurations.filter(function (groupConfiguration) {
				return groupConfiguration._id === groupRelevant[0].configurationId;
			});

			if (!groupConfigurationsRelevant || groupConfigurationsRelevant.length < 1) {
				return;
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
	isScoreIsStrike: function (score, configuration) {
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
		//console.log('beginning to update score:' + userScore.gameId);
		const deferred = Q.defer();
		UserScore.findOneAndUpdate({
			groupId: userScore.groupId,
			userId: userScore.userId,
			gameId: userScore.gameId,
			leagueId: userScore.leagueId
		}, userScore, util.updateSettings).then(function (obj) {
				deferred.resolve(obj);
			}
		);
		return deferred.promise;
	}
};