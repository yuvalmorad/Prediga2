const Q = require('q');
const UserScore = require('../models/userScore');
const User = require('../models/user');
const MatchResult = require('../models/matchResult');
const TeamResult = require('../models/teamResult');
const MatchPrediction = require('../models/matchPrediction');
const TeamPrediction = require('../models/teamPrediction');
const Match = require('../models/match');
const Team = require('../models/team');
const groupConfiguration = require('../models/groupConfiguration');
const util = require('../utils/util');

const self = module.exports = {
	updateAllUserScores: function () {
		const deferred = Q.defer();
		console.log('beginning to update all user scores based on all current match/team results');
		// get {score conf, match results, teams results}
		self.getRelevantDataForUserScore().then(function (obj) {
			self.checkUpdateNeeded(obj).then(function (res) {
				if (res.needUpdate === true) {
					let matchIds = [];
					if (obj.matchResults) {
						matchIds = obj.matchResults.map(function (matchResult) {
							return matchResult.matchId;
						});
					}
					let teamsIds = [];
					if (obj.teamResults) {
						teamsIds = obj.teamResults.map(function (teamResult) {
							return teamResult.teamId;
						});
					}

					return Promise.all([
						Match.find({_id: {$in: matchIds}}),
						Team.find({_id: {$in: teamsIds}})
					]).then(function (arr) {
						return Promise.all([
							self.updateUserScoreByMatchResults(obj.configuration, obj.matchResults, arr[0]),
							self.updateUserScoreByTeamResults(obj.configuration, obj.teamResults, arr[1])
						]).then(function (arr) {
							console.log('Succeed to update all user scores');
							deferred.resolve(res);
						});
					});
				} else {
					console.log('No need to update all user scores');
					deferred.resolve(res);
				}
			});
		});
		return deferred.promise;
	},
	checkUpdateNeeded: function (obj) {
		return Promise.all([
			self.checkUpdateNeededForMatches(obj.matchResults),
			self.checkUpdateNeededForTeams(obj.teamResults)
		]).then(function (arr) {
			let isUpdateNeeded = false;
			if (arr[0].includes(null) || arr[1].includes(null)) {
				isUpdateNeeded = true;
			}

			return {"needUpdate": isUpdateNeeded}
		});
	},
	checkUpdateNeededForMatches: function (matchResults) {
		if (matchResults.length === 0) {
			return Promise.resolve([]);
		}

		const promises = matchResults.map(function (aMatchResult) {
			return UserScore.findOne({gameId: aMatchResult.matchId});
		});
		return Promise.all(promises);
	},
	checkUpdateNeededForTeams: function (teamResults) {
		if (teamResults.length === 0) {
			return Promise.resolve([])
		}

		const promises = teamResults.map(function (aTeamResult) {
			return UserScore.findOne({gameId: aTeamResult.teamId}, function (err, userScore) {
				return !(userScore && typeof(userScore) !== 'undefined');
			});
		});
		return Promise.all(promises);
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
	},
	updateUserScoreByMatchResults: function (configuration, matchResults, matches) {
		if (matchResults.length === 0) {
			return;
		}
		console.log('beginning to update user scores based on ' + matchResults.length + ' matchResults');
		// for each match result, get all matchPredictions
		const promises = matchResults.map(function (aMatchResult) {
			// find leagueId
			const relevantMatch = matches.find(x => x._id.toString() === aMatchResult.matchId);
			if (relevantMatch) {
				const leagueId = relevantMatch.league;
				// find all match predictions, update user score
				return self.updateUserScoreByMatchResult(configuration, aMatchResult, leagueId);
			} else {
				return Promise.resolve();
			}

		});
		return Promise.all(promises);
	},
	updateUserScoreByMatchResult: function (configuration, matchResult, leagueId) {
		const deferred = Q.defer();
		MatchPrediction.find({matchId: matchResult.matchId}, function (err, anUserMatchPredictions) {
			self.updateUserScoreByMatchResultAndUserPredictions(matchResult, configuration, anUserMatchPredictions, leagueId).then(function () {
				deferred.resolve({});
			});
		});
		return deferred.promise;
	},
	updateUserScoreByMatchResultAndUserPredictions: function (matchResult, configuration, anUserMatchPredictions, leagueId) {
		if (anUserMatchPredictions && anUserMatchPredictions.length > 0) {
			//console.log('found ' + anUserMatchPredictions.length + ' user MatchPredictions');
			const promises = anUserMatchPredictions.map(function (userPrediction) {

				// calculate score for user
				const score = self.calculateUserPredictionScore(userPrediction, matchResult, configuration);
				const isStrikeCount = self.isScoreIsStrike(score, configuration);

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
		} else {
			//return self.updateInitialScoreForAllUsers(matchResult.matchId, leagueId);
			return Promise.resolve([]);
		}
	},
	updateInitialScoreForAllUsers: function (matchId, leagueId) {
		return User.find({}, function (err, users) {
			return self.updateInitialScoreForUsers(users, matchId, leagueId);
		});
	},
	updateInitialScoreForUsers: function (users, matchId, leagueId) {
		const promises = users.map(function (user) {
			return self.updateInitialScoreForUser(user, matchId, leagueId);
		});
		return Promise.all(promises);
	},
	updateInitialScoreForUser: function (user, matchId, leagueId) {
		return self.updateScore({
			leagueId: leagueId,
			userId: user._id,
			gameId: matchId,
			score: 0,
			strikes: 0
		});
	},
	updateUserScoreByTeamResults: function (configuration, teamResults) {
		if (teamResults.length === 0) {
			return;
		}
		console.log('beginning to update user scores based on ' + teamResults.length + ' teamResults');
		// for each team result, get all teamPredictions
		const promises = teamResults.map(function (aTeamResult) {
			// for each team result, find all team predictions, update user score
			// find leagueId
			const leagueId = Team.find(x => x._id === aTeamResult.teamId).leagueId;
			return self.updateUserScoreByTeamResult(configuration, aTeamResult, leagueId);
		});
		return Promise.all(promises);
	},
	updateUserScoreByTeamResult: function (configuration, teamResult, leagueId) {
		const deferred = Q.defer();
		TeamPrediction.find({teamId: teamResult.teamId}, function (err, anUserTeamPredictions) {
			if (anUserTeamPredictions && anUserTeamPredictions.length > 0) {
				self.updateUserScoreByTeamResultAndUserPredictions(teamResult, configuration, anUserTeamPredictions, leagueId).then(function () {
					deferred.resolve({});
				});
			} else {
				deferred.resolve({});
			}
		});
		return deferred.promise;
	},
	updateUserScoreByTeamResultAndUserPredictions: function (teamResult, configuration, anUserTeamPredictions, leagueId) {
		//console.log('found ' + anUserTeamPredictions.length + ' user MatchPredictions');
		const promises = anUserTeamPredictions.map(function (userPrediction) {
			let score = 0;
			const configScore = self.convertTeamTypeToConfigScore(teamResult.type, configuration[0]);
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
	getRelevantDataForUserScore: function () {
		return Promise.all([
			groupConfiguration.find({}),
			MatchResult.find({completion: {$gte: 100}}),
			TeamResult.find({})
		]).then(function (arr) {
			return {
				configuration: arr[0],
				matchResults: arr[1],
				teamResults: arr[2],
			}
		});
	},
	calculateUserPredictionScore: function (userPrediction, matchResult, configuration) {
		let score = 0;
		score += util.calculateResult(userPrediction.winner, matchResult.winner, configuration[0].winner);
		score += util.calculateResult(userPrediction.team1Goals, matchResult.team1Goals, configuration[0].team1Goals);
		score += util.calculateResult(userPrediction.team2Goals, matchResult.team2Goals, configuration[0].team2Goals);
		score += util.calculateResult(userPrediction.goalDiff, matchResult.goalDiff, configuration[0].goalDiff);
		score += util.calculateResult(userPrediction.firstToScore, matchResult.firstToScore, configuration[0].firstToScore);
		return score;
	},
	isScoreIsStrike: function (score, configuration) {
		const maxScore = (configuration[0].winner + configuration[0].team1Goals + configuration[0].team2Goals + configuration[0].goalDiff + configuration[0].firstToScore);
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
	}
};