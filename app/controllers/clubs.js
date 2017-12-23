let express = require('express');
let app = express.Router();
let Club = require('../models/club');
let util = require('../utils/util.js');

app.get('/:clubId', util.isLoggedIn, function (req, res) {
    let clubId = req.params.clubId;
    if (!clubId) {
        res.status(500).json(util.getErrorResponse('provide clubId'));
        return;
    }
    Club.findOne({_id: clubId}, function (err, obj) {
        if (err) {
            res.status(403).json(util.getErrorResponse(err.message));
        } else {
            res.status(200).json(obj);
        }
    });
});

app.get('/', util.isLoggedIn, function (req, res) {
    Club.find({}, function (err, obj) {
        res.status(200).json(obj);
    });
});

module.exports = app;