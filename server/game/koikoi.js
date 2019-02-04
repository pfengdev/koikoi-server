let uuidv4 = require('uuid/v4');
let Deck = require('../hanafuda/deck.js');
let Card = require('../hanafuda/card.js');
let Utils = require('../utils/utils.js');
let PointCalc = require('./pointcalc.js');

var KoiKoi = function() {
	const INIT_HAND_SIZE = 8;
	const INIT_TABLE_SIZE = 8;
	const STEP_WAITING = 0;
	const STEP_MATCH_HAND = 1;
	const STEP_MATCH_DECK = 2;
	let deck = new Deck();
	//What's the convention for null? Since it's an obj, should it be {}?
	let topCard = null;
	let hands = {};
	let players = {};
	let playerOrder = [];
	let gameStates = {};
	let table = [];
	let points = 0;
	let activePlayerCtr;
	let id = uuidv4();
	let pointCalc = new PointCalc();



	//should have enum for game step
	function GameState(id) {
		this.id = id;
		this.hand = [];
		this.table = [];
		this.pile = [];
		this.points = pointCalc.calculate([]);
		this.otherPlayers = [];
		this.deckSize = deck.getInitDeckSize();
		this.activePlayerId = null;
		this.step = STEP_WAITING;
		this.topCard = null;
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
			gameStates[id] = new GameState(id);
		});

		KoiKoi.prototype.initPlayerOrder(gameStates);
		gameStates[playerOrder[activePlayerCtr]].step = STEP_MATCH_HAND;

		KoiKoi.prototype.drawForAllPlayers();
		KoiKoi.prototype.drawForTable(INIT_TABLE_SIZE);
		KoiKoi.prototype.syncGameStates();
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
	KoiKoi.prototype.matchHand = function(id, tableIdx, handIdx) {
		if (playerOrder[activePlayerCtr] !== id ||
			gameStates[id].step !== STEP_MATCH_HAND) {
			console.log('not the current players turn or wrong step');
			return;
		}
		
		if (KoiKoi.prototype.matches(table[tableIdx], gameStates[id].hand[handIdx])) {
			KoiKoi.prototype.matchHandHelper(id, tableIdx, handIdx);
			KoiKoi.prototype.setStepToMatchDeck(id);
			KoiKoi.prototype.syncGameStates();
		} else {
			console.log('cards dont match, hand: ' + JSON.stringify(gameStates[id].hand[handIdx]) + "table:" + JSON.stringify(table[tableIdx]));
			return;
		}

	}

	KoiKoi.prototype.matchHandHelper = function(id, tableIdx, handIdx) {
		let gameState = gameStates[id];
		gameState.pile.push(gameState.hand[handIdx]);
	    gameState.pile.push(table[tableIdx]);
	    gameState.hand.splice(handIdx, 1);
		table.splice(tableIdx, 1);
		KoiKoi.prototype.updatePoints(gameState.id);
	}

	KoiKoi.prototype.matchDeck = function(id, tableIdx) {
		if (playerOrder[activePlayerCtr] !== id ||
			gameStates[id].step !== STEP_MATCH_DECK) {
			console.log('not the current players turn or wrong step');
			return;
		}

		if (KoiKoi.prototype.matches(topCard, table[tableIdx])) {
			KoiKoi.prototype.matchDeckHelper(id, tableIdx);
			KoiKoi.prototype.changeTurn();
			KoiKoi.prototype.syncGameStates();
		} else {
			console.log('cards dont match, hand: ' + JSON.stringify(gameStates[id].hand[handIdx]) + "table:" + JSON.stringify(table[tableIdx]));
			return;
		}
	}

	KoiKoi.prototype.matchDeckHelper = function(id, tableIdx) {
		let gameState = gameStates[id];
		gameState.pile.push(topCard);
	    gameState.pile.push(table[tableIdx]);
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

	KoiKoi.prototype.syncGameStates = function() {
		Object.keys(gameStates).forEach(function(id) {
			Object.keys(gameStates).forEach(function(otherId) {
				if (id != otherId) {
					gameStates[id].otherPlayers.push(
						new PartialPlayer(otherId, gameStates[otherId].hand.length,
							gameStates[otherId].pile, gameStates[otherId].points));
				}
			});
		});
		Object.keys(gameStates).forEach(function(id) {
			gameStates[id].table = table;
			gameStates[id].activePlayerId = playerOrder[activePlayerCtr];
			gameStates[id].deckSize = deck.size();
			gameStates[id].topCard = topCard;
		});
	}

	KoiKoi.prototype.setStepToMatchHand = function(id) {
		if (gameStates[id].step === STEP_WAITING) {
			gameStates[id].step = STEP_MATCH_HAND;
		} else {
			console.log("Error: Invalid state machine flow");
		}
	}

	KoiKoi.prototype.setStepToWaiting = function(id) {
		if (gameStates[id].step === STEP_MATCH_DECK) {
			gameStates[id].step = STEP_WAITING;
			topCard = null;
		} else {
			console.log("Error: Invalid state machine flow");
		}
	}

	KoiKoi.prototype.setStepToMatchDeck = function(id) {
		if (gameStates[id].step === STEP_MATCH_HAND) {
			gameStates[id].step = STEP_MATCH_DECK;
			topCard = deck.pop(1)[0];
		} else {
			console.log("Error: Invalid state machine flow");
		}
	}

	KoiKoi.prototype.changeTurn = function() {
		KoiKoi.prototype.setStepToWaiting(playerOrder[activePlayerCtr]);
		activePlayerCtr = (activePlayerCtr+1)%Object.keys(gameStates).length;
		KoiKoi.prototype.setStepToMatchHand(playerOrder[activePlayerCtr]);
	}

	KoiKoi.prototype.updatePoints = function(id) 
	{
	    gameStates[id].points = pointCalc.calculate(gameStates[id].pile);
	}

	KoiKoi.prototype.matches = function(card1, card2) {
		return card1.month === card2.month;
	}

	KoiKoi.prototype.getGameStatesFor= function(id) {
		return JSON.stringify(gameStates[id]);
	}
}

module.exports = KoiKoi;