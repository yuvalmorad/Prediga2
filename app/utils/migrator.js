const MatchResult = require("../models/matchResult");
const TeamResult = require("../models/teamResult");
const MatchPrediction = require("../models/matchPrediction");
const TeamPrediction = require("../models/teamPrediction");
const UserScore = require("../models/userScore");
const UsersLeaderboard = require("../models/usersLeaderboard");
const Club = require("../models/club");
const Match = require("../models/match");
const utils = require("../utils/util");

const self = module.exports = {

	run: function () {
		return Promise.all([
			//self.updateAllToIds(),
			//self.updateUserScoreAndLeaderboardWithIsraeliLeagueId()
			//self.fixOppositeIsraeliLeagueScores()
		]).then(function (arr) {
			console.log('migration finished');
		});
	},
	// TODO - can run once and then can be disabled.
	updateUserScoreAndLeaderboardWithIsraeliLeagueId: function () {
		return Promise.all([
			self.migrateUserScoreWithLeagueId(),
			self.migrateLeaderboardWithLeagueId()
		]).then(function (arr) {
			console.log('updateUserScoreAndLeaderboardWithIsraeliLeagueId finished');
		});
	},
	migrateUserScoreWithLeagueId: function () {
		return UserScore.find({}, function (err, userScores) {
			if (userScores) {
				const promises = userScores.map(function (userScore) {
					userScore.leagueId = '5a21a7c1a3f89181074e9769';
					return UserScore.findOneAndUpdate({_id: userScore._id}, userScore, utils.updateSettings);
				});
				return Promise.all(promises);
			}
		});
	},
	migrateLeaderboardWithLeagueId: function () {
		return UsersLeaderboard.find({}, function (err, usersLeaderboards) {
			if (usersLeaderboards) {
				const promises = usersLeaderboards.map(function (usersLeaderboard) {
					usersLeaderboard.leagueId = '5a21a7c1a3f89181074e9769';
					return UsersLeaderboard.findOneAndUpdate({_id: usersLeaderboard._id}, usersLeaderboard, utils.updateSettings);
				});
				return Promise.all(promises);
			}
		});
	},
	// TODO - can run once and then can be disabled.
	updateAllToIds: function () {
		return Club.find({}, function (err, clubs) {
			return Promise.all([
				self.migrateMatchPredictions(clubs),
				//self.migrateTeamPredictions(clubs),
				//self.migrateMatchResults(clubs),
				//self.migrateTeamResults(clubs),
			]).then(function (arr) {
				console.log('updateAllToIds finished');
			});
		});
	},
	migrateMatchPredictions: function (clubs) {
		return MatchPrediction.find({}, function (err, matchPredictions) {
			if (matchPredictions) {
				const promises = matchPredictions.map(function (matchPrediction) {
					const newWinner = self.getClubIdByName(clubs, matchPrediction.winner);
					if (newWinner) {
						matchPrediction.winner = newWinner;
					}

					const newFirstToScore = self.getClubIdByName(clubs, matchPrediction.firstToScore);
					if (newFirstToScore) {
						matchPrediction.firstToScore = newFirstToScore;
					}
					return MatchPrediction.findOneAndUpdate({_id: matchPrediction._id}, matchPrediction, utils.updateSettings);
				});
				return Promise.all(promises);
			}
		});
	},
	migrateMatchResults: function (clubs) {
		return MatchResult.find({}, function (err, matchResults) {
			if (matchResults) {
				const promises = matchResults.map(function (matchResult) {
					const newWinner = self.getClubIdByName(clubs, matchResult.winner);
					if (newWinner) {
						matchResult.winner = newWinner;
					}

					const newFirstToScore = self.getClubIdByName(clubs, matchResult.firstToScore);
					if (newFirstToScore) {
						matchResult.firstToScore = newFirstToScore;
					}
					return MatchResult.findOneAndUpdate({_id: matchResult._id}, matchResult, utils.updateSettings);
				});
				return Promise.all(promises);
			}
		});
	},
	migrateTeamPredictions: function (clubs) {
		return TeamPrediction.find({}, function (err, teamPredictions) {
			if (teamPredictions) {
				const promises = teamPredictions.map(function (teamPrediction) {
					const newTeam = self.getClubIdByName(clubs, teamPrediction.team);
					if (newTeam) {
						teamPrediction.team = newTeam;
					}
					return TeamPrediction.findOneAndUpdate({_id: teamPrediction._id}, teamPrediction, utils.updateSettings);
				});
				return Promise.all(promises);
			}
		});
	},
	migrateTeamResults: function (clubs) {
		return TeamResult.find({}, function (err, teamResults) {
			if (teamResults) {
				const promises = teamResults.map(function (teamResult) {
					const newTeam = self.getClubIdByName(clubs, teamResult.team);
					if (newTeam) {
						teamResult.team = newTeam;
					}

					return TeamResult.findOneAndUpdate({_id: teamResult._id}, teamResult, utils.updateSettings);
				});
				return Promise.all(promises);
			}
		});
	},
	getClubIdByName: function (clubs, name) {
		const clubRequested = clubs.find(x => x.name === name);
		if (clubRequested) {
			return clubRequested._id;
		}
		return name;
	},
	fixOppositeIsraeliLeagueScores: function () {
		const now = new Date();
		return Match.find({kickofftime: {$lte: now}}, function (err, matches) {
			const matchIds = matches.map(function (match) {
				return match._id;
			});
			return Promise.all([
				self.fixOppositeIsraeliLeagueScoresMatches(matchIds),
				self.fixOppositeIsraeliLeagueScoresMatcheResults(matchIds)
			]).then(function (arr) {
				console.log('fixOppositeIsraeliLeagueScores finished');
			});
		});
	},
	fixOppositeIsraeliLeagueScoresMatches: function (matchIds) {
		return MatchPrediction.find({matchId: {$in: matchIds}}, function (err, matchPredictions) {
			if (matchPredictions) {
				const promises = matchPredictions.map(function (matchPrediction) {
					const temp = matchPrediction.team1Goals;
					matchPrediction.team1Goals = matchPrediction.team2Goals;
					matchPrediction.team2Goals = temp;
					return MatchPrediction.findOneAndUpdate({_id: matchPrediction._id}, matchPrediction, utils.updateSettings);
				});
				return Promise.all(promises);
			}
		});
	},
	fixOppositeIsraeliLeagueScoresMatcheResults: function (matchIds) {
		return MatchResult.find({matchId: {$in: matchIds}}, function (err, matchResults) {
			if (matchResults) {
				const promises = matchResults.map(function (matchResult) {
					const temp = matchResult.team1Goals;
					matchResult.team1Goals = matchResult.team2Goals;
					matchResult.team2Goals = temp;
					return MatchResult.findOneAndUpdate({_id: matchResult._id}, matchResult, utils.updateSettings);
				});
				return Promise.all(promises);
			}
		});
	}
};