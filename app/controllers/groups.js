const express = require('express');
const app = express.Router();
const Group = require('../models/group');
const GroupConfiguration = require('../models/groupConfiguration');
const groupService = require('../services/groupService');
const groupConfigurationService = require('../services/groupConfigurationService');
const util = require('../utils/util.js');
const mongoose = require('mongoose');

// Get groups by user
app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;

	Group.find({users: userId}, function (err, obj) {
		if (err || !obj) {
			res.status(403).json(util.getErrorResponse('error'));
		} else {
			res.status(200).json(obj);
		}
	});
});

// Get All groups
app.get('/allGroups', util.isLoggedIn, function (req, res) {
    Group.find({}, function (err, obj) {
        if (err || !obj) {
            res.status(403).json(util.getErrorResponse('error'));
        } else {
            res.status(200).json(obj);
        }
    });
});

// Get group by (user & groupId) and populate group configuration.
app.get('/:groupId', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	const groupId = req.params.groupId;
	if (!groupId) {
		res.status(500).json(util.getErrorResponse('provide groupId'));
		return;
	}

	Group.findOne({users: userId, _id: groupId}, function (err, groupObj) {
		if (err || !groupObj) {
			res.status(403).json(util.getErrorResponse('error'));
		} else {
			GroupConfiguration.findOne({_id: groupObj.configurationId}, function (err, configObj) {
				groupObj.configuration = configObj;
				res.status(200).json(groupObj);
			});

		}
	});
});

// Create/update group
app.post('/', util.isLoggedIn, function (req, res) {
	const group = req.body;
	if (!group) {
		res.status(500).json(util.getErrorResponse('provide group in body'));
		return;
	}
	group.createdBy = req.user._id;
	if (!group._id) {
		group._id = mongoose.Types.ObjectId();
	}
	Group.findOne({_id: group._id}, function (err, obj) {
		let isOkToCreate = false;

		if (err || !obj) {
			// no such group id, ok to create
			isOkToCreate = true;
			group.users = [group.createdBy]; // add owner to be a user
		} else {
			// update
			isOkToCreate = (obj.createdBy === group.createdBy.toString());
		}

		if (isOkToCreate) {
			let isValid = checkInput(group);
			if (isValid) {
				let groupConfiguration = group.configuration;
				if (!groupConfiguration._id) {
					groupConfiguration._id = mongoose.Types.ObjectId();
				}
				group.configurationId = groupConfiguration._id;
				delete group.configuration;
				groupService.updateGroup(group).then(function (obj) {
					let newGroupObj = obj;
					groupConfigurationService.updateConfiguration(groupConfiguration).then(function (newConfig) {
						newGroupObj._doc.configuration = newConfig._doc;
						res.status(200).json(newGroupObj);
					}, function (msg) {
						res.status(500).json({error: msg});
					});
				}, function (msg) {
					res.status(500).json({error: msg});
				});
			} else {
				res.status(500).json({error: 'id not valid'});
			}
		} else {
			res.status(500).json({error: 'You are trying to update existing group you are not the owner.'});
		}
	});
});

function checkInput(group) {
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

// Delete group & configuration
app.delete('/:groupId', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	const groupId = req.params.groupId;
	if (!groupId) {
		res.status(500).json(util.getErrorResponse('provide groupId'));
		return;
	}
	Group.findOneAndRemove({_id: groupId, createdBy: userId}, function (err, obj) {
		if (err || !obj) {
			res.status(500).json(util.getErrorResponse('error'));
		} else {
			GroupConfiguration.findOneAndRemove({_id: obj.configurationId}, function (err, obj) {
				res.status(200).json(util.okResponse);
			});
		}
	});
});

// Join group
app.post('/:groupId/register', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	const groupId = req.params.groupId;
	if (!groupId) {
		res.status(500).json(util.getErrorResponse('provide groupId'));
		return;
	}
	let secret = req.query.secret;
	if (!secret) {
		secret = '';
	}
	Group.findOneAndUpdate({_id: groupId, secret: secret}, {$addToSet: {users: userId}}).then(function (obj) {
		if (!obj) {
			res.status(500).json({});
		} else {
			res.status(200).json({});
		}
	});
});

// Leave group
app.delete('/:groupId/unregister', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;
	const groupId = req.params.groupId;
	if (!groupId) {
		res.status(500).json(util.getErrorResponse('provide groupId'));
		return;
	}
	Group.findOneAndUpdate({_id: groupId}, {$pull: {users: userId}}).then(function (obj) {
		if (!obj) {
			res.status(500).json({});
		} else {
			res.status(200).json({});
		}
	});
});


module.exports = app;