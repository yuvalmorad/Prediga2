let io;

let self = module.exports = {
    init: function (server) {
        io = require('socket.io')(server);
        self.connect();
    },

    connect: function () {
        io.on('connection', function (socket) {
            socket.emit('message', {message: 'Welcome back'});
        });
    },

    emit: function (path, obj) {
        io.emit(path, obj);
    }
};