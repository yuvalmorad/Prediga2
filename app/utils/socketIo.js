let io;
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const MongoStore = require('../mongoStore');
let usersSockets = {}; //by userId

function getUserIdFromSocket(socket, callback) {
    var cookie_string = socket.request.headers.cookie;
    var parsed_cookies = cookie.parse(cookie_string);
    var connect_sid = parsed_cookies['connect.sid'];
    if (connect_sid) {
        var connect_sidParsed = cookieParser.signedCookie(connect_sid, process.env.SESSION_SECRET ? process.env.SESSION_SECRET : "loginboilerplate");
        MongoStore.get(connect_sidParsed, function(err, session) {
            var userId = session.passport.user;
            if (userId) {
                callback(userId);
            }
        });
    }
}

const self = module.exports = {
	init: function (server) {
		io = require('socket.io')(server);
		self.connect();
	},

	connect: function () {
		io.on('connection', function (socket) {
            getUserIdFromSocket(socket, function(userId) {
                usersSockets[userId] = socket;
			});
            socket.on("disconnect", function() {
                getUserIdFromSocket(socket, function(userId) {
					delete usersSockets[userId];
                });
        	});
		});
	},

	emit: function (path, obj) {
		io.emit(path, obj);
	},

	emitToSpecificUserIds: function(userIds, key, objToSend) {
        userIds.forEach(function(userId){
            var socket = usersSockets[userId];
            if (socket) {
                socket.emit(key, objToSend);
			}
		})
	}
};