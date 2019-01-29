var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
	res.sendFile(__dirname, "/index.html");
});

http.listen(3000, function() {
	console.log("Server started on port ${http.address().port}");
});