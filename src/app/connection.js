define([
    '/socket.io/socket.io.js'
],function (io) {
    var socket;

    function connect(){
        socket = io.connect('http://localhost:8080/');
        socket.on('server event', onServerEvent);
    }

    function onServerEvent(event) {
        console.log(event);
        if(event.name == 'get image with tag'){
            //get image info and put on map
        }
    }

    function isDisconnected(){
        return !socket;
    }

    var Connection = {};

    Connection.followTag = function(tagName){
        if(isDisconnected()){
            connect();
        }

        socket.emit('client event', {
            command: 'start follow tag',
            data: {
                tags: tagName
            }
        });
    }

    return Connection;
});