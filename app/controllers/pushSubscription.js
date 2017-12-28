const express = require('express');
const app = express.Router();
let util = require('../utils/util');
const pushSubscription = require('../models/pushSubscription');

app.post('/', util.isLoggedIn, function (req, res) {
    const userId = req.user._id;
    const pushSubscriptionObj = req.body.pushSubscription;

    console.log("pushSubscriptionObj", pushSubscriptionObj);

    pushSubscription.findOneAndUpdate({
        userId: userId
    }, {userId: userId, $addToSet: {pushSubscriptions: pushSubscriptionObj}}, util.updateSettings).then(function(){
        res.status(200).json({});
    })
});

app.get('/', util.isLoggedIn, function (req, res) {
    const userId = req.user._id;
    pushSubscription.findOne({
        userId: userId
    }).then(function(obj){
        console.log("obj", obj);
        res.status(200).json({
            pushSubscriptions: obj ? obj.pushSubscriptions : []
        });
    });
});

module.exports = app;