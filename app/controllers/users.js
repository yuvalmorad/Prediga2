var express = require('express');
var app = express.Router();
var User = require('../models/user');
var util = require('../utils/util.js');

app.get('/:userId', util.isLoggedIn, function (req, res) {
    var userId = req.params.userId;
    if (!userId) {
        res.status(200).json({});
        return;
    }
    User.findOne({_id: userId}, function (err, aUser) {
        if (err || !aUser) {
            res.status(403).json({});
        } else {
            res.status(200).json(aUser);
        }
    });

});

app.delete('/:userId', util.isLoggedIn, function (req, res) {
    var userId = req.params.userId;
    if (!userId) {
        res.status(200).json({});
        return;
    }
    User.findOneAndRemove({_id: userId}, function (err, aUser) {
        if (err || !aUser) {
            res.status(403).json({});
        } else {
            res.status(200).json('{}');
        }
    });
});

app.get('/', util.isLoggedIn, function (req, res) {
    User.find({}, function (err, aUsers) {
        if (err) {
            res.status(200).json([]);
        } else {
            res.status(200).json(aUsers);
        }
    });

});


module.exports = app;