const util = require('../utils/util');
const mongoose = require('mongoose');
const Groups = require('../models/group');

const self = module.exports = {
	updateGroup: function (groupObj) {
		return Groups.findOneAndUpdate({
			_id: groupObj._id, createdBy: groupObj.createdBy
		}, groupObj, util.updateSettings);
	},
	removeGroupContent: function (groupId, userId) {
		return Groups.findOneAndRemove({_id: groupId, createdBy: userId}).then(function (groupRemoved) {
			return Promise.resolve(groupRemoved);
		});
	},
	validateBeforeCreateOrUpdate: function (group, isNew) {
		if (!self.validateArr(group.leagueIds)) {
			return false;
		}

		if (!self.validateArr(group.users)) {
			return false;
		}

		if (!self.validateStringNotEmpty(group.name)) {
			return false;
		}

		// if is not new, we don't pass the secret
		if (isNew && !self.validateStringNotEmpty(group.secret)) {
			return false;
		}
		return true;
	},
	validateStringNotEmpty: function (str) {
		return !(!str || str.length < 1);
	},
	validateArr: function (arr) {
		if (!arr || !Array.isArray(arr)) {
			return false;
		}
		let isAllValidIds = true;
		arr.forEach(function (item) {
			if (!mongoose.Types.ObjectId.isValid(item)) {
				isAllValidIds = false;
			}
		});
		return isAllValidIds;
	},
	getLeagueIdMap: function (groups) {
		const leagueIdsArr = groups.map(function (group) {
			return group.leagueIds;
		});
		return [].concat.apply([], leagueIdsArr);
	},
	getConfigurationIdMap: function (groups) {
		const configurationIdArr = groups.map(function (group) {
			return group.configurationId;
		});
		return [].concat.apply([], configurationIdArr);
	},
	getUsersMap: function (groups) {
		const usersArr = groups.map(function (group) {
			return group.users;
		});
		return [].concat.apply([], usersArr);
	},
	byId: function (id) {
		return Groups.findOne({_id: id});
	},
	byIds: function (ids) {
		return Groups.find({_id: {$in: ids}});
	},
	byUserId: function (userId) {
		return Groups.find({users: userId});
	},
	byUserIdAndId: function (userId, id) {
		return Groups.findOne({users: userId, _id: id});
	},
	byUserIdAndLeagueId: function (userId, leagueId) {
		return Groups.find({users: userId, leagueIds: leagueId});
	},
	byLeagueId: function (leagueId) {
		return Groups.find({leagueIds: leagueId});
	},
	byUsrIdAndConfigurationId: function (userId, configurationId) {
		return Groups.find({users: userId, configurationId: configurationId});
	},
	all: function (userRequested) {
		return Groups.find({}).then(function (allGroups) {
			allGroups.forEach(function (group) {
				if (userRequested) {
					self.verifyOnlyAdminCanSeeSecret(group, userRequested);
				}
			});
			return allGroups;
		});
	},
	verifyOnlyAdminCanSeeSecret: function (group, userId) {
		if (userId.toString() !== group.createdBy) {
			delete group._doc.secret;
		}
	},
	detachConfiguration: function (group) {
		let configuration = group.configuration;
		if (!configuration._id) {
			configuration._id = mongoose.Types.ObjectId();
		}
		group.configurationId = configuration._id;
		delete group.configuration;
		return configuration;
	},
	addUser: function (id, secret, userId) {
		return Groups.findOneAndUpdate({_id: id, secret: secret}, {$addToSet: {users: userId}});
	},
	removeUser: function (id, userId) {
		return Groups.findOneAndUpdate({_id: id}, {$pull: {users: userId}});
	},
	removeUserByOwner: function (id, owner, userId) {
		return Groups.findOneAndUpdate({_id: id, createdBy: owner}, {$pull: {users: userId}});
	},
	filterByGroupId: function (groups, groupId) {
		return groups.filter(function (group) {
			return group._id.toString() === groupId;
		});
	},
	autoLogin: function (req) {
		var path = req.session.returnTo || "/";
        return Promise.resolve(path);

		/* Removed as we don't want people to enter in the middle.
		var groupId = path.split("/")[2];
		var autoJoinIdx = path.indexOf("?autoJoin");
		if (groupId && autoJoinIdx >= 0) {
			// autoJoin group flow
			// removing the autoJoin to avoid loop
			path = path.substring(0, autoJoinIdx);

			// find and join group
			return Groups.findOne({_id: groupId}).then(function (group) {
				if (group) {
					return Groups.findOneAndUpdate({_id: groupId}, {$addToSet: {users: req.user._id}}).then(function () {
						return Promise.resolve(path);
					});
				} else {
					return Promise.resolve(path);
				}
			});
		} else {
			// regular flow
			return Promise.resolve(path);
		}*/
	}
};