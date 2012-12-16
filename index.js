var express = require('express'),
    app = express(),
    server = require('http').createServer(app);

server.listen(process.env.PORT || 8080);

var Connection = require('./src/connection')(server);

app.use(express.static(__dirname + '/client'));