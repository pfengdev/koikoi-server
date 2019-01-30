const KEEP_ALIVE_INTVL = 20000;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var users = {};

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
  	socket.on('disconnect', function () {
    	disconnectUser(socket.id);
  	});
  } else {
  	console.log('too many users');
  	disconnectUser(socket.id);
  }

  if (Object.keys(users).length === 2) {
  	console.log('Begin game');
  	init(users);
  	Object.keys(users).forEach(function(id) {
  		io.to(id).emit("initGame", JSON.stringify(gameStates[id]));
  	});
  }
});

io.sockets.on('connection', function(socket) {
	socket.on('stillalive', function() {
		//console.log('Received stillalive');
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

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
	res.sendFile(__dirname, "/index.html");
});

http.listen(3000, function() {
	console.log("Server started on port ${http.address().port}");
});















/*Temporary code to be moved to another js*/
const NUM_OF_MONTHS = 12;
const NUM_OF_CARDS_PER_MONTH = 4;
const INIT_HAND_SIZE = 8;
const INIT_TABLE_SIZE = 8;
const INIT_DECK_SIZE = 48;
var deck = [];
var topIdx;
var hands = {};
var players = {};
var playerOrder = [];
var gameStates = {};
var aiHand = [];
var table = [];
var pile = [];
var points = 0;
var activePlayerIdx;

function GameState(id, hand, table, pile, points, otherHands, deckSize, activePlayer) {
	this.id = id;
	this.hand = hand;
	this.table = table;
	this.pile = pile;
	this.points = points;
	this.otherHands = otherHands;
	this.deckSize = deckSize;
	this.activePlayer = activePlayer;
}

function Card(month, cardNum) {
    this.month = month;
    this.cardNum = cardNum;
}

function PartialPlayer(id, handSize) {
	this.id = id;
	this.handSize = handSize;
}

function init(users) {
	Object.keys(users).forEach(function(id) {
		gameStates[id] = new GameState(id, [], [], [], 0, [], 
			INIT_DECK_SIZE, playerOrder[activePlayerIdx]);
	});

	initDeck();
	shuffleDeck(deck);
	initPlayerOrder(gameStates);
	Object.keys(gameStates).forEach(function(id) {
		gameStates[id].hand = draw(INIT_HAND_SIZE, gameStates[id].hand);
		Object.keys(gameStates).forEach(function(otherId) {
			if (id != otherId) {
				gameStates[id].otherHands.push(new PartialPlayer(otherId, gameStates[otherId].hand.length));
			}
		});
	});

	table = draw(INIT_TABLE_SIZE, table);
	Object.keys(gameStates).forEach(function(id) {
		gameStates[id].table = table;
	});
}

function initDeck() {
    topIdx = 0;
    deck = [];
    for (let i = 1; i <= NUM_OF_MONTHS; i++) {
        for (let j = 1; j <= NUM_OF_CARDS_PER_MONTH; j++) {
            deck.push(new Card(i, j));
        }
    }
}

/*Knuth shuffle*/
function shuffle(deck) {
    let currIdx = deck.length;
    let swapIdx;
    let temp;
    while (currIdx !== 0) {
        currIdx--;
        swapIdx = Math.floor(Math.random()*currIdx);
        temp = deck[currIdx];
        deck[currIdx] = deck[swapIdx];
        deck[swapIdx] = temp;
    }
    return deck;
}

function shuffleDeck() {
	deck = shuffle(deck);
}

function initPlayerOrder(gameStates) {
	Object.keys(gameStates).forEach(function(id) {
		playerOrder.push(id);
	});
	playerOrder = shuffle(playerOrder);
	activePlayerIdx = 0;
}

/*Doesn't handle hand size limit. Needs to ask player to discard cards*/
function draw(numOfCards, handArr) {
    topIdx += numOfCards;
    let cards = deck.slice(topIdx-numOfCards, topIdx);
    for (let i = 0; i < cards.length; i++) {
    	handArr.push(cards[i]);
    }
    return handArr;
}