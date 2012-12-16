module.exports = function(server){
    var Connection = {};

    var io = require('socket.io').listen(server);

    //Heroku
    //The WebSockets protocol is not yet supported on the Cedar stack.
    //https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
    io.configure(function () {
        io.set("transports", ["xhr-polling"]);
        io.set("polling duration", 10);
    });

    io.sockets.on('connection', function (socket) {
        console.log('connect', socket);

        socket.on('client event', function (event) {
            console.log('client event');

            if(event.command == 'start follow tag'){
                //TODO : add Real time photo update http://instagram.com/developer/realtime/
                //send back
                socket.emit('server event', {
                    name: 'get image with tag',
                    data: {
                        url : ''
                    }
                });
            }

        });
    });

    return Connection;
}