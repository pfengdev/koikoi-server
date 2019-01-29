var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var players = {};

//How to stop someone from connecting?
io.on('connection', function (socket) {
  if (Object.keys(players).length < 2) {
  	console.log('a user connected: ' + socket.id);
  	players[socket.id] = {
  		playerId: socket.id
  	};
  	console.log(players);
  	socket.emit('currentPlayers', players);
  	socket.broadcast.emit('newPlayer', players[socket.id]);
  	socket.on('disconnect', function () {
    	disconnectPlayer(socket.id);
  	});
  } else {
  	console.log('too many users');
  	disconnectPlayer(socket.id);
  }
});

//How to force someone to disconnect?
function disconnectAllPlayers() {
	console.log('user abandoned game. exiting game. disconnecting all users');
	players = {};
	Object.keys(players).forEach(function(id) {
		io.emit('disconnect', id);
	});
}

function disconnectPlayer(id) {
	console.log('user disconnected: ' + id);
    delete players[id];
    io.emit('disconnect', id);
}

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
	res.sendFile(__dirname, "/index.html");
});

http.listen(3000, function() {
	console.log("Server started on port ${http.address().port}");
});