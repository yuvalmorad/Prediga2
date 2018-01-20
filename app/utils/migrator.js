const MatchResult = require("../models/matchResult");
const TeamResult = require("../models/teamResult");
const MatchPrediction = require("../models/matchPrediction");
const TeamPrediction = require("../models/teamPrediction");
const UserScore = require("../models/userScore");
const UsersLeaderboard = require("../models/usersLeaderboard");
const Club = require("../models/club");
const Match = require("../models/match");
const utils = require("../utils/util");
const Group = require("../models/group");
const User = require("../models/user");

const self = module.exports = {

	run: function () {
		return Promise.all([
			//self.migrateUserScore(),
			//self.migrateLeaderboard(),
			//self.migrateMatchPredictions(),
			//self.migrateTeamPredictions(),
			//self.migrateUsers(),
			//self.migrateMatchResults()
			//self.migrateTeamResults()
		]).then(function (arr) {
			console.log('[Init] - Migration finished');
		});
	},
	migrateUserScore: function () {
		return UserScore.find({}, function (err, userScores) {
			if (userScores) {
				const promises = userScores.map(function (userScore) {
					userScore.groupId = utils.DEFAULT_GROUP;
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
					usersLeaderboard.groupId = utils.DEFAULT_GROUP;
					return UsersLeaderboard.findOneAndUpdate({_id: usersLeaderboard._id}, usersLeaderboard, utils.updateSettings);
				});
				return Promise.all(promises);
			}
		});
	},
	migrateMatchPredictions: function () {
		return MatchPrediction.find({}, function (err, matchPredictions) {
			if (matchPredictions) {
				const promises = matchPredictions.map(function (matchPrediction) {
					matchPrediction.groupId = utils.DEFAULT_GROUP;
					return MatchPrediction.findOneAndUpdate({_id: matchPrediction._id}, matchPrediction, utils.updateSettings);
				});
				return Promise.all(promises);
			}
		});
	},
	migrateMatchResults: function () {
		return MatchResult.find({}, function (err, matchResults) {
			if (matchResults) {
				const promises = matchResults.map(function (matchResult) {
					return MatchResult.findOneAndUpdate({_id: matchResult._id}, matchResult, utils.updateSettings);
				});
				return Promise.all(promises);
			}
		});
	},
	migrateTeamPredictions: function () {
		return TeamPrediction.find({}, function (err, teamPredictions) {
			if (teamPredictions) {
				const promises = teamPredictions.map(function (teamPrediction) {
					teamPrediction.groupId = utils.DEFAULT_GROUP;
					return TeamPrediction.findOneAndUpdate({_id: teamPrediction._id}, teamPrediction, utils.updateSettings);
				});
				return Promise.all(promises);
			}
		});
	},
	migrateTeamResults: function () {
		return TeamResult.find({}, function (err, teamResults) {
			if (teamResults) {
				const promises = teamResults.map(function (teamResult) {
					return TeamResult.findOneAndUpdate({_id: teamResult._id}, teamResult, utils.updateSettings);
				});
				return Promise.all(promises);
			}
		});
	},
	migrateUsers: function () {
		return User.find({}, function (err, users) {
			if (users) {
				const promises = users.map(function (user) {
					return Group.findOneAndUpdate({_id: utils.DEFAULT_GROUP}, {$addToSet: {users: user._id}});
				});
				return Promise.all(promises);
			}
		});
	}
};