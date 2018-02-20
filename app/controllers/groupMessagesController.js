const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const groupMessagesService = require('../services/groupMessagesService');

/**
 * Get all messages from group
 */
app.get('/:groupId', util.isLoggedIn, function (req, res) {
    const groupId = req.params.groupId;

    groupMessagesService.getAllMessagesByGroup(groupId).then(function(messages){
        res.status(200).json(messages);
	});
});

/**
 * create a message in a group
 */

app.post('/:groupId', util.isLoggedIn, function (req, res) {
    const userId = req.user._id;
    const groupId = req.params.groupId;
    const message = req.body;
    //message should have: {message}

    message.userId = userId;
    message.groupId = groupId;

    groupMessagesService.createMessageGroup(message).then(function(message){
        res.status(200).json(message);
    });
});


module.exports = app;