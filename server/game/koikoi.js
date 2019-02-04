let uuidv4 = require('uuid/v4');
let Deck = require('../hanafuda/deck.js');
let Card = require('../hanafuda/card.js');
let Utils = require('../utils/utils.js');
let Pile = require('./pile.js');

var KoiKoi = function() {
	const INIT_HAND_SIZE = 8;
	const INIT_TABLE_SIZE = 8;
	let deck = new Deck();
	let hands = {};
	let players = {};
	let playerOrder = [];
	let gameStates = {};
	let table = [];
	let points = 0;
	let activePlayerCtr;
	let id = uuidv4();

	function GameState(id, hand, table, pile, points, otherPlayers, deckSize, activePlayerId) {
		this.id = id;
		this.hand = hand;
		this.table = table;
		this.pile = pile;
		this.points = points;
		this.otherPlayers = otherPlayers;
		this.deckSize = deckSize;
		this.activePlayerId = activePlayerId;
	}

	function PartialPlayer(id, handSize, pile, points) {
		this.id = id;
		this.handSize = handSize;
		this.pile = pile;
		this.points = points;
	}

	KoiKoi.prototype.init = function(users) {
		KoiKoi.prototype.initDeck();
		KoiKoi.prototype.shuffleDeck();

		Object.keys(users).forEach(function(id) {
			gameStates[id] = new GameState(id, [], [], new Pile(), 0, [], deck.size(), null);
		});

		KoiKoi.prototype.initPlayerOrder(gameStates);

		KoiKoi.prototype.drawForAllPlayers();
		KoiKoi.prototype.drawForTable(INIT_TABLE_SIZE);
		KoiKoi.prototype.syncgameStates();
	}

	KoiKoi.prototype.initDeck = function() {
	    deck = new Deck();
	    deck.init();
	}

	KoiKoi.prototype.resetDeck = function() {
		deck.init();
	}

	KoiKoi.prototype.shuffleDeck = function() {
		deck.shuffle();
	}

	KoiKoi.prototype.initPlayerOrder = function(gameStates) {
		Object.keys(gameStates).forEach(function(id) {
			playerOrder.push(id);
		});
		playerOrder = Utils.shuffle(playerOrder);
		activePlayerCtr = 0;
	}

	//Refactor functions to make more sense
	//If user double clicks there will be a race condition?
	KoiKoi.prototype.match = function(id, handIdx, tableIdx) {
		if (playerOrder[activePlayerCtr] !== id) {
			console.log('not the current players turn');
			return;
		}
		console.log("inside match: " + JSON.stringify(gameStates[id].hand[handIdx]) + " table: " + JSON.stringify(table[tableIdx]));
		if (KoiKoi.prototype.matches(gameStates[id].hand[handIdx], table[tableIdx])) {
			KoiKoi.prototype.matchCards(id, handIdx, tableIdx);
			KoiKoi.prototype.drawForPlayer(id, 1);
			KoiKoi.prototype.drawForTable(1);
			KoiKoi.prototype.changeTurn();
			KoiKoi.prototype.syncgameStates();
		} else {
			console.log('cards dont match');
			return;
		}

	}

	KoiKoi.prototype.matchCards = function(id, handIdx, tableIdx) {
		let gameState = gameStates[id];
		gameState.pile.push(gameState.hand[handIdx]);
	    gameState.pile.push(table[tableIdx]);
	    gameState.hand.splice(handIdx, 1);
		table.splice(tableIdx, 1);
	    KoiKoi.prototype.updatePoints(gameState.id);
	}

	/*Doesn't handle hand size limit. Needs to ask player to discard cards*/
	KoiKoi.prototype.draw = function(numOfCards, handArr) {
		let arr = handArr.slice();
	    let cards = deck.pop(numOfCards);
	    cards.forEach(function(card) {
	    	arr.push(card);
	    });
	    return arr;

	}

	KoiKoi.prototype.drawForAllPlayers = function() {
		Object.keys(gameStates).forEach(function(id) {
			KoiKoi.prototype.drawForPlayer(id, INIT_HAND_SIZE);
		});
	}

	KoiKoi.prototype.drawForPlayer = function(id, numOfCards) {
		gameStates[id].hand = KoiKoi.prototype.draw(numOfCards, gameStates[id].hand);
	}

	KoiKoi.prototype.drawForTable = function(numOfCards) {
		table = KoiKoi.prototype.draw(numOfCards, table);
	}

	KoiKoi.prototype.syncgameStates = function() {
		Object.keys(gameStates).forEach(function(id) {
			Object.keys(gameStates).forEach(function(otherId) {
				if (id != otherId) {
					gameStates[id].otherPlayers.push(
						new PartialPlayer(otherId, gameStates[otherId].hand.length,
							gameStates[otherId].pile.toArray(), gameStates[otherId].points));
				}
			});
		});
		Object.keys(gameStates).forEach(function(id) {
			gameStates[id].table = table;
			gameStates[id].activePlayerId = playerOrder[activePlayerCtr];
			gameStates[id].deckSize = deck.size();
		});
	}

	KoiKoi.prototype.changeTurn = function() {
		activePlayerCtr = (activePlayerCtr+1)%Object.keys(gameStates).length;
	}

	KoiKoi.prototype.updatePoints = function(id) 
	{
	    gameStates[id].points = gameStates[id].pile.getPoints();
	}

	KoiKoi.prototype.matches = function(card1, card2) {
		return card1.month === card2.month;
	}

	KoiKoi.prototype.getGameStatesFor= function(id) {
		return JSON.stringify(gameStates[id]);
	}
}

module.exports = KoiKoi;