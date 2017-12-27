var socket = (function(){
    var socket = io();

    socket.on('connect', function(){
        console.log("connected!!!");
    });
    socket.on('message', function(data){
        console.log("message!!!", data);
    });
    socket.on('disconnect', function(){
        console.log("disconnect!!!");
    });

    return socket;
})();
