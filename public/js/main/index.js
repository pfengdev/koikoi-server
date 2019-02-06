var socket;
var id;
var activePlayerId;
var deckSize;
var step;
var handIdx;
var tableIdx;
var topCard;
var canvas;
var renderer;

//Add underscores to make things private i.e. _password
//how to deal with resizing? ideally don't resize when window changes
const STEP_WAITING = 0;
const STEP_MATCH_HAND = 1;
const STEP_MATCH_DECK = 2;
const INIT_GAME = 'initGame';
const UPDATE = 'update';
const KEEP_ALIVE = 'keepalive';
const CANVAS_ID = 'table';
const TABLE = 'table';
const HAND = 'hand';
const DECK_SIZE = 'deckSize';
const STEP = 'step';
const HAND_SIZE = 'handSize';
const PILE = 'pile';
const POINTS = 'points';
const OTHER_PLAYERS = 'otherPlayers';
const TOP_CARD = 'topCard';
const ACTIVE_PLAYER_ID = 'activePlayerId';
const ID = 'id';
const MATCH_HAND = 'matchHand';
const MATCH_DECK = 'matchDeck';

function init() {
    canvas = document.getElementById(CANVAS_ID);
    if (canvas.getContext) {
        this.socket = io();
        //Is it possible for there to be a race condition
        this.socket.on(INIT_GAME, function(res) {
            gameState = initGame(res);
        });
        this.socket.on(UPDATE, function(res) {
            updateGameState(res);
            renderer.render();
        });
        this.socket.on(KEEP_ALIVE, function() {
            //console.log('received keepalive');
            socket.emit('stillalive');
        });
        let ctx = canvas.getContext('2d');
        renderer = new Renderer(ctx);
    }
}

function initGame(res) {
    updateGameState(res);
    canvas.addEventListener("click", onClick);
    renderer.render();
}

function updateGameState(res) {
    gameState = JSON.parse(res);
    deckSize = gameState[DECK_SIZE];
    activePlayerId = gameState[ACTIVE_PLAYER_ID];
    id = gameState[ID];
    step = gameState[STEP];
    updateRenderer(gameState);
}

function updateRenderer(gameState) {
    renderer.setTable(gameState[TABLE]);
    renderer.setTopCard(gameState[TOP_CARD]);
    renderer.setId(gameState[ID]);
    updatePlayers(gameState);
}

function updatePlayers(gameState) {
    let playerArr = renderer.players;
    // console.log(playerArr);
    // console.log(Object.keys(playerArr) === true);
    // if (playerArr !== {}) {
    //     console.log("update???");
    //     playerArr[id].hand = gameState[HAND];
    //     playerArr[id].pile = gameState[PILE];
    //     playerArr[id].points = gameState[POINTS];
    //     gameState[OTHER_PLAYERS].forEach(function(other) {
    //         /*Have to make a new array every time. Wasteful*/
    //         playerArr[other.id].hand = Array.apply(null, Array(other.handSize));
    //         playerArr[other.id].pile = other.pile;
    //         playerArr[other.id].points = other.points;
    //     });
    // } else {
        // console.log("init");
        // console.log("id: " + id);
        playerArr[id] = new Player(gameState[HAND], gameState[PILE], gameState[POINTS]);
        gameState[OTHER_PLAYERS].forEach(function(other) {
            playerArr[other.id] = new Player(Array.apply(null, Array(other.handSize)), other.pile, other.points);
        });
        renderer.initPlayerRenderers();
    // }
}



function onClick(event)
{
    let canvasRect = canvas.getBoundingClientRect();
    let x = event.clientX - canvasRect.left;
    let y = event.clientY - canvasRect.top;    
    
    if (isStepMatchHand()) {
        if (renderer.insideHand(x, y)) {
            handIdx = renderer.getHandIdx(x);
            paintGame();
        }

        if (handIdx != null &&
            renderer.insideTable(x, y)) {
                let tableIdx = renderer.getTableIdx(x, y);
                if (isHandMatching(tableIdx, handIdx)) {
                    sendMatchCards(tableIdx, handIdx);
                }
            handIdx = null;
        }
    }

    if (isStepMatchDeck()) {
        if (renderer.insideTable(x, y)) {
                let tableIdx = renderer.getTableIdx(x, y);
                if (isDeckMatching(tableIdx)) {
                    sendMatchCards(tableIdx);
                }
            handIdx = null;
        }
    }
}

function isHandMatching(tableIdx, handIdx)
{
    //should use prototype and define equals function
    return hand[handIdx].month === table[tableIdx].month;
}

function isDeckMatching(tableIdx)
{
    //should use prototype and define equals function
    return topCard.month === table[tableIdx].month;
}

function sendMatchCards(tableIdx, selectedIdx)
{
    if (step === STEP_MATCH_HAND) {
        this.socket.emit(MATCH_HAND, tableIdx, selectedIdx);
    } else if (step === STEP_MATCH_DECK) {
        this.socket.emit(MATCH_DECK, tableIdx);
    }
}

function isMyTurn() {
    return activePlayerId === id
}

function isStepMatchHand() {
    return isMyTurn() && step === STEP_MATCH_HAND; 
}

function isStepMatchDeck() {
    return isMyTurn() && step === STEP_MATCH_DECK; 
}
