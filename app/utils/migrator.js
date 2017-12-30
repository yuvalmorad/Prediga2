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
			//self.migrateUserScore(),
			//self.migrateLeaderboard()
			//self.migrateMatchPredictions()
			//self.migrateMatchResults()
			//self.migrateTeamPredictions(),
			//self.migrateTeamResults()
		]).then(function (arr) {
			console.log('migration finished');
		});
	},
	migrateUserScore: function () {
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
	migrateLeaderboard: function () {
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
	migrateMatchPredictions: function (clubs) {
		return MatchPrediction.find({}, function (err, matchPredictions) {
			if (matchPredictions) {
				const promises = matchPredictions.map(function (matchPrediction) {

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
					if (typeof(matchResult.active) === 'undefined') {
						matchResult.active = false;
					}
					if (!matchResult.active) {
						matchResult.active = false;
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
	}
};