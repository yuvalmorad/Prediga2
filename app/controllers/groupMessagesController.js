const express = require('express');
const app = express.Router();
const util = require('../utils/util.js');
const groupMessagesService = require('../services/groupMessagesService');
const groupMessagesReadService = require('../services/groupMessagesReadService');
const SocketIo = require('../utils/socketIo');
const groupService = require('../services/groupService');

/**
 * TEST! TODO remove!
 */

app.post('/createTestMessage/:groupId', function (req, res) {
    const userId = "5a2d98c34e0e780015a04fe1"; //gilad
    const groupId = req.params.groupId;
    const message = req.body;

    message.userId = userId;
    message.groupId = groupId;

    groupMessagesService.createMessageGroup(message).then(function(message){
        res.status(200).json(message);

        groupService.byId(message.groupId).then(function (group) {
            //send to all (logged in) users in group except for the sender
            let users = group.users.filter(function(user){
                return user !== message.userId.toString();
            });
            SocketIo.emitToSpecificUserIds(users, "newGroupMessage", message);
        });
    });
});


/**
 * Get unread messges count of all groups by user
 */
app.get('/getUnReadMessages', util.isLoggedIn, function (req, res) {
    const userId = req.user._id;
    groupMessagesReadService.getgetUnReadMessagesOfUserInAllGroups(userId).then(function(unreadMessagesByGroups){
        var promises = unreadMessagesByGroups.map(function(unreadMessagesByGroup){
            var groupId = unreadMessagesByGroup.groupId;
            var lastReadDate = unreadMessagesByGroup.lastReadDate;
            return groupMessagesService.getCountMessagesOfGroupFromDate(groupId, lastReadDate).then(function(count){
               return {
                   count: count,
                   groupId: this
               }
            }.bind(groupId));
        });

        Promise.all(promises).then(function(promisesRes){
            res.status(200).json(promisesRes);
        });
    });
});


/**
 * Get all messages from group
 */
app.get('/:groupId', util.isLoggedIn, function (req, res) {
    const groupId = req.params.groupId;
    const userId = req.user._id;

    groupMessagesService.getAllMessagesByGroup(groupId).then(function(messages){
        groupMessagesReadService.setLastReadMessage(userId, groupId).then(function(){
            res.status(200).json(messages);
        });
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
            let users = group.users.filter(function(user){
                return user !== message.userId.toString();
            });
            SocketIo.emitToSpecificUserIds(users, "newGroupMessage", message);
        });

        groupMessagesReadService.setLastReadMessage(userId, groupId).then(function(){
        });
    });
});


module.exports = app;