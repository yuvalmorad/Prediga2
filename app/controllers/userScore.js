const express = require('express');
const app = express.Router();
const UserScore = require('../models/userScore');
const util = require('../utils/util.js');

app.get('/', util.isAdmin, function (req, res) {
    UserScore.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

module.exports = app;