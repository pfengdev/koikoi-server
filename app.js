const KEEP_ALIVE_INTVL = 20000;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var KoiKoi = require('./server/game/koikoi.js');
var users = {};
var games = {};
var usersToGames = {};
//Is this really necessary?
var gamesToUsers = {};

//Handle cookies
//How to stop someone from connecting?
io.on('connection', function (socket) {
  if (Object.keys(users).length < 2) {
  	console.log('a user connected: ' + socket.id);
  	users[socket.id] = {
  		id: socket.id
  	};
  	socket.emit('currentUsers', users);
  	socket.broadcast.emit('newUser', users[socket.id]);
  	setTimeout(function() {
  		keepAlive(socket.id); }, KEEP_ALIVE_INTVL);
  	//handle ghost users
  	socket.on('disconnect', function () {
    	disconnectUser(socket.id);
  	});
  } else {
  	console.log('too many users');
  	disconnectUser(socket.id);
  }

  if (Object.keys(users).length === 2) {
  	console.log('Begin game');
  	let newGame = new KoiKoi();
  	games[newGame.id] = newGame;
  	//Need to fix this obviously
  	gamesToUsers[newGame.id] = [];
  	Object.keys(users).forEach(function(id) {
  		usersToGames[id] = newGame.id;
  		gamesToUsers[newGame.id].push(id);
  	});
  	newGame.init(users);
  	sendUpdatedGameStates('initGame', newGame);
  }
});

io.sockets.on('connection', function(socket) {
	socket.on('stillalive', function() {
		//console.log('Received stillalive');
	});
	socket.on('matchHand', function(tableIdx, handIdx) {
		//console.log("on match");
		let gameId = usersToGames[socket.id];
		//console.log("got gameid");
		let selectedGame = games[gameId];
		//console.log('gameId: ' + gameId + " selectedGame: " + selectedGame);
		selectedGame.matchHand(socket.id, tableIdx, handIdx);
		sendUpdatedGameStates('update', selectedGame);
	});
  socket.on('matchDeck', function(tableIdx) {
    //console.log("on match");
    let gameId = usersToGames[socket.id];
    //console.log("got gameid");
    let selectedGame = games[gameId];
    //console.log('gameId: ' + gameId + " selectedGame: " + selectedGame);
    selectedGame.matchDeck(socket.id, tableIdx);
    sendUpdatedGameStates('update', selectedGame);
  });
});

//How to force someone to disconnect?
function disconnectAllUsers() {
	console.log('user abandoned game. exiting game. disconnecting all users');
	users = {};
	Object.keys(users).forEach(function(id) {
		io.emit('disconnect', id);
	});
}

function disconnectUser(id) {
	console.log('user disconnected: ' + id);
    delete users[id];
    io.emit('disconnect', id);
}

function keepAlive(id) {
    setTimeout(function() {
    	keepAlive(id); }, KEEP_ALIVE_INTVL);
    //console.log('sending keepalive');
    io.to(id).emit('keepalive');
}

function sendUpdatedGameStates(evt, selectedGame) {
	console.log("send update for: " + evt);
	let selectedUsers = gamesToUsers[selectedGame.id];
	selectedUsers.forEach(function(id) {
  		io.to(id).emit(evt, selectedGame.getGameStatesFor(id));
  	});
}

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
	res.sendFile(__dirname, "/index.html");
});

//put 3000 in env var?
http.listen(3000, function() {
	console.log("Server started on port ${http.address().port}");
});