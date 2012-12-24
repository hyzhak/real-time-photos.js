var express = require('express'),
    app = express(),
    server = require('http').createServer(app);

var port = process.env.PORT || 8080;
server.listen(port, function() {
    console.log("Listening on " + port);
});

var Connection = require('./src/connection')(server);

app.use(express.static(__dirname + '/client'));