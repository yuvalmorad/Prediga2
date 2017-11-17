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
    User.findOne({_id: userId}, function (err, obj) {
        if (err || !obj) {
            res.status(403).json({});
        } else {
            res.status(200).json(obj);
        }
    });

});

app.delete('/:userId', util.isAdmin, function (req, res) {
    var userId = req.params.userId;
    if (!userId) {
        res.status(500).json({});
        return;
    }
    User.findOneAndRemove({_id: userId}, function (err, obj) {
        if (err || !obj) {
            res.status(500).json({});
        } else {
            res.status(200).json('{}');
        }
    });
});

app.get('/', util.isLoggedIn, function (req, res) {
    User.find({}, function (err, obj) {
        if (err) {
            res.status(200).json([]);
        } else {
            res.status(200).json(obj);
        }
    });

});


module.exports = app;