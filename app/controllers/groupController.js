const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const mongoose = require('mongoose');
const groupService = require('../services/groupService');
const groupConfigurationService = require('../services/groupConfigurationService');
const usersLeaderboardService = require('../services/usersLeaderboardService');
const userScoreService = require('../services/userScoreService');
const matchPredictionsService = require('../services/matchPredictionsService');
const teamPredictionsService = require('../services/teamPredictionsService');
/**
 * All groups the user is part of.
 */
app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	groupService.byUserId(userId).then(function (groups) {
		if (!groups) {
			res.status(200).json([]);
		} else {
			res.status(200).json(groups);
		}
	});
});

/**
 * All, no matter the user's partnership
 */
app.get('/all', util.isLoggedIn, function (req, res) {
	return groupService.all().then(function (groups) {
		if (!groups) {
			res.status(200).json([]);
		} else {
			res.status(200).json(groups);
		}
	});
});

/**
 * By Group Id, only if user is part of.
 */
app.get('/:groupId', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	const groupId = req.params.groupId;
	if (!groupId) {
		res.status(400).json({});
		return;
	}

	return groupService.byUserIdAndId(userId, groupId).then(function (group) {
		if (!group) {
			res.status(200).json({});
		} else {
			return groupConfigurationService.byId(group.configurationId).then(function (configuration) {
				if (configuration) {
					group.configuration = configuration;
				}
				res.status(200).json(group);
			});
		}
	});
});

/**
 * Create/Update Group
 */
app.post('/', util.isLoggedIn, function (req, res) {
	const group = req.body;
	if (!group) {
		res.status(400).json({});
		return;
	}

	let isNew = !group.id;
	if (isNew) {
		group.createdBy = req.user._id;
		group._id = mongoose.Types.ObjectId();
		group.users = [group.createdBy];
	}

	let isInputValid = groupService.validateBeforeCreateOrUpdate(group);
	if (!isInputValid) {
		res.status(400).json({});
		return;
	}
	let configuration = groupService.detachConfiguration(group);
	return groupService.updateGroup(group).then(function (newGroup) {
		return groupConfigurationService.updateConfiguration(configuration).then(function (newConfig) {
			newGroup._doc.configuration = newConfig._doc;
			res.status(200).json(newGroup);
		}, function (err) {
			res.status(400).json({error: err});
		});
	});
});

/**
 * Delete group and it's configuration
 */
app.delete('/:groupId', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	const groupId = req.params.groupId;
	if (!groupId) {
		res.status(400).json(util.getErrorResponse());
		return;
	}
	return removeGroupContent(groupId, userId).then(function (obj) {
		res.status(200).json(obj);
	});
});

/**
 * Add user to group
 */
app.post('/:groupId/register', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	const groupId = req.params.groupId;
	if (!groupId) {
		res.status(400).json(util.getErrorResponse());
		return;
	}
	let secret = req.query.secret;
	if (!secret) {
		res.status(400).json(util.getErrorResponse());
		return;
	}
	return groupService.addUser(groupId, secret, userId).then(function (newGroup) {
		if (!newGroup) {
			res.status(400).json({});
		} else {
			res.status(200).json(newGroup);
		}
	});
});

/**
 * Remove user from group
 */
app.delete('/:groupId/unregister', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	const groupId = req.params.groupId;
	if (!groupId) {
		res.status(400).json(util.getErrorResponse());
		return;
	}
	return groupService.removeUser(groupId, userId).then(function (newGroup) {
		if (!newGroup) {
			res.status(400).json({});
		} else {
			return removeGroupContentOfOneUser(groupId, userId).then(function () {
				res.status(200).json({});
			});
		}
	});
});

/**
 * Remove user from group by owner
 */
app.delete('/:groupId/kick', util.isLoggedIn, function (req, res) {
	const owner = req.user._id;
	const userId = req.query.userId;
	const groupId = req.params.groupId;
	if (!groupId) {
		res.status(400).json(util.getErrorResponse());
		return;
	}
	return groupService.removeUserByOwner(groupId, owner, userId).then(function (newGroup) {
		if (!newGroup) {
			res.status(400).json({});
		} else {
			return removeGroupContentOfOneUser(groupId, userId).then(function () {
				res.status(200).json({});
			});
		}
	});
});

function removeGroupContentOfOneUser(groupId, userId) {
	return Promise.all([
		usersLeaderboardService.removeByGroupIdAndUserId(groupId, userId),
		userScoreService.removeByGroupIdAndUserId(groupId, userId),
		matchPredictionsService.removeByGroupIdAndUserId(groupId, userId),
		teamPredictionsService.removeByGroupIdAndUserId(groupId, userId)
	]).then(function (arr) {
		// TODO - update leaderboard for group
		return Promise.resolve({});
	});
}

function removeGroupContent(groupId, userId) {
	return Promise.all([
		groupService.removeGroupContent(groupId, userId),
	]).then(function (arr) {
		let groupRemoved = arr[0];
		if (!groupRemoved){
			return Promise.reject();
		}
		return Promise.all([
			groupConfigurationService.removeById(groupRemoved.configurationId),
			usersLeaderboardService.removeByGroupId(groupId),
			userScoreService.removeByGroupId(groupId),
			matchPredictionsService.removeByGroupId(groupId),
			teamPredictionsService.removeByGroupId(groupId)
		]).then(function (arr) {
			return Promise.resolve({});
		});
	});


}
module.exports = app;