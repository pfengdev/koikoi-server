var otherPlayers;
var deckSize;
var aiHand;
var table;
var pile;
var selectedCardIdx;
var socket;
var gameState;
var activePlayerId;
var step;
var renderer;
var playerArea;
var centerArea;

//Add underscores to make things private i.e. _password
//put these in constants js?
//how to deal with resizing? ideally don't resize when window changes
const STEP_WAITING = 0;
const STEP_MATCH_HAND = 1;
const STEP_MATCH_DECK = 2;


function init() {
    this.socket = io();
    //Is it possible for there to be a race condition
    this.socket.on('initGame', function(res) {
        gameState = initGame(res);
    });
    this.socket.on('update', function(res) {
        updateGameState(res);
        paintGame();
    });
    this.socket.on('keepalive', function() {
        console.debug('received keepalive');
        socket.emit('stillalive');
    });
    playerArea = new PlayerArea();
    centerArea = new CenterArea();
    renderer = new Renderer(playerArea, centerArea);
}

function initGame(res) {
    updateGameState(res);
    canvas.addEventListener("click", onTableClick);
}

function updateGameState(res) {
    gameState = JSON.parse(res);
    hand = gameState['hand'];
    table = gameState['table'];
    deckSize = gameState['deckSize'];
    pile = gameState['pile'];
    points = gameState['points'];
    otherPlayers = gameState['otherPlayers'];
    activePlayerId = gameState['activePlayerId'];
    step = gameState['step'];
    topCard = gameState['topCard'];
}



function onTableClick(event)
{
    let canvasRect = canvas.getBoundingClientRect();
    let x = event.clientX - canvasRect.left;
    let y = event.clientY - canvasRect.top;    
    
    if (isStepMatchHand()) {
        if (insidePlayerArea(x, y)) {
            selectedCardIdx = getSelectedCardIdx(x);
            paintGame();
        }

        if (selectedCardIdx != null &&
            insideCenterArea(x, y)) {
                let tableSelectedCardIdx = getSelectedTableCardIdx(x, y);
                if (isHandMatching(tableSelectedCardIdx, selectedCardIdx)) {
                    sendMatchCards(tableSelectedCardIdx, selectedCardIdx);
                }
            selectedCardIdx = null;
        }
    }

    if (isStepMatchDeck()) {
        if (insideCenterArea(x, y)) {
                let tableSelectedCardIdx = getSelectedTableCardIdx(x, y);
                if (isDeckMatching(tableSelectedCardIdx)) {
                    sendMatchCards(tableSelectedCardIdx);
                }
            selectedCardIdx = null;
        }
    }
}

function getSelectedCardIdx(x) {
    return Math.floor((x-PLYR_AREA_this.START_X)/CARD_WIDTH);
}

function getSelectedTableCardIdx(x, y) {
    let idx = Math.floor((x-CTR_AREA_this.START_X)/CARD_WIDTH)*TABLE_COL_SIZE;
    idx = Math.floor((y-CTR_AREA_this.START_Y)/CARD_HEIGHT)==0 ? idx : idx+1;
    return idx;
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

function sendMatchCards(tableSelectedCardIdx, selectedIdx)
{
    if (step === STEP_MATCH_HAND) {
        this.socket.emit('matchHand', tableSelectedCardIdx, selectedIdx);
    } else if (step === STEP_MATCH_DECK) {
        this.socket.emit('matchDeck', tableSelectedCardIdx);
    }
}

function isMyTurn() {
    return activePlayerId === this.socket.id
}

function isStepMatchHand() {
    return isMyTurn() && step === STEP_MATCH_HAND; 
}

function isStepMatchDeck() {
    return isMyTurn() && step === STEP_MATCH_DECK; 
}
