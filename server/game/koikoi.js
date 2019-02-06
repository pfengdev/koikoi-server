const uuidv4 = require('uuid/v4');
const Deck = require('../hanafuda/deck.js');
const Card = require('../hanafuda/card.js');
const Utils = require('../utils/utils.js');
const PointCalc = require('./pointcalc.js');

//concat array
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
	let utils = new Utils();



	//should have enum for game step
	function GameState(id) {
		this.id = id;
		this.hand = [];
		this.table = [];
		this.pile = [];
		this.points = pointCalc.calculate([]);
		this.otherPlayers = [];
		this.deckSize = deck.INIT_SIZE;
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

	var init = function(users) {
		initDeck();
		shuffleDeck();

		Object.keys(users).forEach(function(id) {
			gameStates[id] = new GameState(id);
		});

		initPlayerOrder(gameStates);
		gameStates[playerOrder[activePlayerCtr]].step = STEP_MATCH_HAND;

		drawForAllPlayers();
		drawForTable(INIT_TABLE_SIZE);
		syncGameStates();
	}

	var initDeck = function() {
	    deck = new Deck();
	    deck.init();
	}

	var resetDeck = function() {
		deck.init();
	}

	var shuffleDeck = function() {
		deck.shuffle();
	}

	var initPlayerOrder = function(gameStates) {
		Object.keys(gameStates).forEach(function(id) {
			playerOrder.push(id);
		});
		playerOrder = utils.shuffle(playerOrder);
		activePlayerCtr = 0;
	}

	//Refactor functions to make more sense
	//If user double clicks there will be a race condition?
	var matchHand = function(id, tableIdx, handIdx) {
		if (playerOrder[activePlayerCtr] !== id ||
			gameStates[id].step !== STEP_MATCH_HAND) {
			console.log('not the current players turn or wrong step');
			return;
		}
		
		if (matches(table[tableIdx], gameStates[id].hand[handIdx])) {
			matchHandHelper(id, tableIdx, handIdx);
			setStepToMatchDeck(id);
			syncGameStates();
		} else {
			console.log('cards dont match, hand: ' + JSON.stringify(gameStates[id].hand[handIdx]) + "table:" + JSON.stringify(table[tableIdx]));
			return;
		}

	}

	var matchHandHelper = function(id, tableIdx, handIdx) {
		let gameState = gameStates[id];
		gameState.pile.push(gameState.hand[handIdx]);
	    gameState.pile.push(table[tableIdx]);
	    gameState.hand.splice(handIdx, 1);
		table.splice(tableIdx, 1);
		updatePoints(gameState.id);
	}

	var matchDeck = function(id, tableIdx) {
		if (playerOrder[activePlayerCtr] !== id ||
			gameStates[id].step !== STEP_MATCH_DECK) {
			console.log('not the current players turn or wrong step');
			return;
		}

		if (matches(topCard, table[tableIdx])) {
			matchDeckHelper(id, tableIdx);
			changeTurn();
			syncGameStates();
		} else {
			console.log('cards dont match, hand: ' + JSON.stringify(gameStates[id].hand[handIdx]) + "table:" + JSON.stringify(table[tableIdx]));
			return;
		}
	}

	var matchDeckHelper = function(id, tableIdx) {
		let gameState = gameStates[id];
		gameState.pile.push(topCard);
	    gameState.pile.push(table[tableIdx]);
		table.splice(tableIdx, 1);
		updatePoints(gameState.id);
	}

	/*Doesn't handle hand size limit. Needs to ask player to discard cards*/
	var draw = function(numOfCards, handArr) {
		let arr = handArr.slice();
	    let cards = deck.pop(numOfCards);
	    return arr.concat(cards);

	}

	var drawForAllPlayers = function() {
		Object.keys(gameStates).forEach(function(id) {
			drawForPlayer(id, INIT_HAND_SIZE);
		});
	}

	var drawForPlayer = function(id, numOfCards) {
		gameStates[id].hand = draw(numOfCards, gameStates[id].hand);
	}

	var drawForTable = function(numOfCards) {
		table = draw(numOfCards, table);
	}

	var syncGameStates = function() {
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

	var setStepToMatchHand = function(id) {
		if (gameStates[id].step === STEP_WAITING) {
			gameStates[id].step = STEP_MATCH_HAND;
		} else {
			console.log("Error: Invalid state machine flow");
		}
	}

	var setStepToWaiting = function(id) {
		if (gameStates[id].step === STEP_MATCH_DECK) {
			gameStates[id].step = STEP_WAITING;
			topCard = null;
		} else {
			console.log("Error: Invalid state machine flow");
		}
	}

	var setStepToMatchDeck = function(id) {
		if (gameStates[id].step === STEP_MATCH_HAND) {
			gameStates[id].step = STEP_MATCH_DECK;
			topCard = deck.pop(1)[0];
		} else {
			console.log("Error: Invalid state machine flow");
		}
	}

	var changeTurn = function() {
		setStepToWaiting(playerOrder[activePlayerCtr]);
		activePlayerCtr = (activePlayerCtr+1)%Object.keys(gameStates).length;
		setStepToMatchHand(playerOrder[activePlayerCtr]);
	}

	var updatePoints = function(id) 
	{
	    gameStates[id].points = pointCalc.calculate(gameStates[id].pile);
	}

	var matches = function(card1, card2) {
		return card1.month === card2.month;
	}

	var getGameStatesFor = function(id) {
		return JSON.stringify(gameStates[id]);
	}

	return {
		init : init,
		matchHand : matchHand,
		matchDeck : matchDeck,
		getGameStatesFor: getGameStatesFor
	};
}

module.exports = KoiKoi;