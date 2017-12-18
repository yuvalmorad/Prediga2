let express = require('express');
let app = express.Router();
let TeamResult = require('../models/teamResult');
let util = require('../utils/util.js');

app.get('/', util.isLoggedIn, function (req, res) {
    TeamResult.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

app.get('/:teamId', util.isLoggedIn, function (req, res) {
    let teamId = req.params.teamId;
    if (!teamId) {
        res.status(500).json(util.errorResponse.format('provide teamId'));
        return;
    }
    TeamResult.findOne({teamId: teamId}, function (err, obj) {
        if (err || !obj) {
            res.status(403).json(util.errorResponse.format('no team result'));
        } else {
            res.status(200).json(obj);
        }
    });
});
module.exports = app;