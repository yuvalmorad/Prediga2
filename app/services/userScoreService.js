const Q = require('q');
const UserScore = require('../models/userScore');
const MatchPrediction = require('../models/matchPrediction');
const TeamPrediction = require('../models/teamPrediction');
const GroupConfiguration = require('../models/groupConfiguration');
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
				return Promise.resolve();
			}
		});
		return Promise.all(promises);
	},
	updateUserScoreByMatchResult: function (matchResult, leagueId) {
		const deferred = Q.defer();
		MatchPrediction.find({matchId: matchResult.matchId}, function (err, anUserMatchPredictions) {
			if (anUserMatchPredictions && anUserMatchPredictions.length > 0){
				// TODO - get all group Ids and with them the group's configurations
				GroupConfiguration.find({}).then(function (groupConfigurations) {
					self.updateUserScoreByMatchResultAndUserPredictions(matchResult, groupConfigurations, anUserMatchPredictions, leagueId).then(function () {
						deferred.resolve({});
					});
				});
			} else {
				deferred.resolve({});
			}

		});
		return deferred.promise;
	},
	updateUserScoreByMatchResultAndUserPredictions: function (matchResult, groupConfigurations, anUserMatchPredictions, leagueId) {
		//console.log('found ' + anUserMatchPredictions.length + ' user MatchPredictions');
		const promises = anUserMatchPredictions.map(function (userPrediction) {

			// calculate score for user
			const score = self.calculateUserPredictionScore(userPrediction, matchResult, groupConfigurations[0]);
			const isStrikeCount = self.isScoreIsStrike(score, groupConfigurations[0]);

			// score to update
			const userScore = {
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
		const deferred = Q.defer();
		TeamPrediction.find({teamId: teamResult.teamId}, function (err, anUserTeamPredictions) {
			if (anUserTeamPredictions && anUserTeamPredictions.length > 0) {
				// TODO - get all group Ids and with them the group's configurations
				GroupConfiguration.find({}).then(function (groupConfigurations) {
					self.updateUserScoreByTeamResultAndUserPredictions(teamResult, groupConfigurations, anUserTeamPredictions, leagueId).then(function () {
						deferred.resolve({});
					});
				});
			} else {
				deferred.resolve({});
			}
		});
		return deferred.promise;
	},
	updateUserScoreByTeamResultAndUserPredictions: function (teamResult, groupConfigurations, anUserTeamPredictions, leagueId) {
		//console.log('found ' + anUserTeamPredictions.length + ' user MatchPredictions');
		const promises = anUserTeamPredictions.map(function (userPrediction) {
			let score = 0;
			const configScore = self.convertTeamTypeToConfigScore(teamResult.type, groupConfigurations[0]);
			score += util.calculateResult(userPrediction.team, teamResult.team, configScore);
			return self.updateScore({
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
				userId: userScore.userId,
				gameId: userScore.gameId,
				leagueId: userScore.leagueId
			}, userScore, util.updateSettings, function (err, obj) {
				if (err) {
					deferred.resolve();
				} else {
					//console.log('succeed to update score:' + userScore.gameId);
					deferred.resolve();
				}
			}
		);
		return deferred.promise;
	}
};