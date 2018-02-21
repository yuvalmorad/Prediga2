const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const groupMessagesService = require('../services/groupMessagesService');
const SocketIo = require('../utils/socketIo');
const groupService = require('../services/groupService');

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

    message.userId = userId;
    message.groupId = groupId;

    groupMessagesService.createMessageGroup(message).then(function(message){
        res.status(200).json(message);

        groupService.byId(message.groupId).then(function (group) {
            //send to all (logged in) users in group except for the sender
            var users = group.users.filter(function(user){
                return user !== message.userId.toString();
            });
            SocketIo.emitToSpecificUserIds(users, "newGroupMessage", message);
        });
    });
});


module.exports = app;