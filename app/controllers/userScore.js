let express = require('express');
let app = express.Router();
let UserScore = require('../models/userScore');
let util = require('../utils/util.js');

app.get('/', util.isAdmin, function (req, res) {
    UserScore.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

module.exports = app;