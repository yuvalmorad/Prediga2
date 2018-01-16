const Q = require('q');
const Groups = require('../models/group');
const GroupConfiguration = require('../models/groupConfiguration');
const UsersLeaderboard = require('../models/usersLeaderboard');
const UserScore = require('../models/userScore');
const MatchPrediction = require('../models/matchPrediction');
const TeamPrediction = require('../models/teamPrediction');
const util = require('../utils/util');
const mongoose = require('mongoose');

module.exports = {
	updateGroup: function (groupObj) {
		const deferred = Q.defer();
		Groups.findOneAndUpdate({_id: groupObj._id}, groupObj, util.updateSettings).then(function (obj) {
				deferred.resolve(obj);
			}
		);
		return deferred.promise;
	},
	removeGroupContent: function (groupId, userId) {
		return Promise.all([
			Groups.findOneAndRemove({_id: groupId, createdBy: userId}),
			GroupConfiguration.findOneAndRemove({_id: obj.configurationId}),
			UsersLeaderboard.remove({groupId: groupId}),
			UserScore.remove({groupId: groupId}),
			MatchPrediction.remove({groupId: groupId}),
			TeamPrediction.remove({groupId: groupId}),

		]).then(function (arr) {
			return Promise.resolve();
		});
	},
	removeGroupContentOfOneUser: function (groupId, userId) {
		return Promise.all([
			UsersLeaderboard.remove({groupId: groupId, userId: userId}),
			UserScore.remove({groupId: groupId, userId: userId}),
			MatchPrediction.remove({groupId: groupId, userId: userId}),
			TeamPrediction.remove({groupId: groupId, userId: userId}),

		]).then(function (arr) {
			// TODO - update leaderboard for group
			return Promise.resolve();
		});
	},
	checkInput: function (group) {
		if (!group.leagueIds || !Array.isArray(group.leagueIds)) {
			return false;
		}
		let isAllValidIds = true;
		group.leagueIds.forEach(function (leagueId) {
			if (!mongoose.Types.ObjectId.isValid(leagueId)) {
				isAllValidIds = false;
			}
		});
		if (!isAllValidIds) {
			return false;
		}

		if (group.users) {
			if (!Array.isArray(group.users)) {
				return false;
			}
			group.users.forEach(function (user) {
				if (!mongoose.Types.ObjectId.isValid(user)) {
					isAllValidIds = false;
				}
			});
		}

		if (!isAllValidIds) {
			return false;
		}

		if (!group.name || group.name.length < 1) {
			return false;
		}
		group.name = group.name.trim();

		if (!group.secret || group.secret.length < 1) {
			return false;
		}
		group.secret = group.secret.trim();

		if (!group.configuration) {
			group.configuration = {
				_id: mongoose.Types.ObjectId()
			}
		}
		return true;
	}
};