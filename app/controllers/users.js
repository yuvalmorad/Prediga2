const express = require('express');
const app = express.Router();
const User = require('../models/user');
const Group = require('../models/group');
const util = require('../utils/util.js');

app.get('/:userId', util.isLoggedIn, function (req, res) {
	const userId = req.params.userId;
	if (!userId) {
		res.status(500).json(util.getErrorResponse('provide userId'));
		return;
	}
	User.findOne({_id: userId}, function (err, obj) {
		if (err || !obj) {
			res.status(403).json(util.getErrorResponse('error'));
		} else {
			res.status(200).json(obj);
		}
	});
});

app.delete('/:userId', util.isAdmin, function (req, res) {
	const userId = req.params.userId;
	if (!userId) {
		res.status(500).json(util.getErrorResponse('provide userId'));
		return;
	}
	User.findOneAndRemove({_id: userId}, function (err, obj) {
		if (err || !obj) {
			res.status(500).json(util.getErrorResponse('error'));
		} else {
			res.status(200).json(util.okResponse);
		}
	});
});

app.get('/', util.isLoggedIn, function (req, res) {
	const userId = req.user._id;

	// requested users from the same group
	return Promise.all([
		Group.find({users: userId})
	]).then(function (groups) {
		if (groups[0]) {
			const usersArr = groups[0].map(function (group) {
				return group.users;
			});
			let mergedUsers = [].concat.apply([], usersArr);
			return User.find({_id: {$in: mergedUsers}}, function (err, relevantUsers) {
				if (err) {
					res.status(500).json(util.getErrorResponse('error'));
				} else {
					res.status(200).json(relevantUsers);
				}
			});
		} else {
			return [];
		}
	});
});

// get users by specific ids
app.post('/', util.isLoggedIn, function (req, res) {
	const ids = req.body.ids;
	if (!ids || !Array.isArray(ids)) {
		res.status(500).json(util.getErrorResponse('provide ids'));
		return;
	}
	return User.find({_id: {$in: ids}}, function (err, relevantUsers) {
		if (err) {
			res.status(500).json(util.getErrorResponse('error'));
		} else {
			res.status(200).json(relevantUsers);
		}
	});
});


module.exports = app;