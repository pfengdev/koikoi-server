var cardImg;
var canvas;
var ctx;
var hand;
var otherPlayers;
var deckSize;
var aiHand;
var table;
var pile;
var aiPile;
var selectedCardIdx;
var points;
var socket;
var gameState;
var activePlayerId;
var numImagesLoaded;

//Add underscores to make things private i.e. _password
//put these in constants js?
//how to deal with resizing? ideally don't resize when window changes
const INIT_HAND_SIZE = 8;
const INIT_TABLE_SIZE = 8;
const TABLE_ROW_SIZE = 4;
const X_OFFSET = 1;
const Y_OFFSET = 2;
const CARD_HEIGHT = 86.5;
const CARD_WIDTH = 53.33;
const CARD_IMG_HEIGHT = 928;
const CARD_IMG_WIDTH = 1600;
const BG_HEIGHT = 750;
const BG_WIDTH = 1000;
const PLYR_AREA_START_X = 200;
const PLYR_AREA_END_X = PLYR_AREA_START_X + CARD_WIDTH*INIT_HAND_SIZE;
const PLYR_AREA_START_Y = 450;
const PLYR_AREA_END_Y = PLYR_AREA_START_Y + CARD_HEIGHT;
const OPP_AREA_START_X = PLYR_AREA_START_X;
const OPP_AREA_START_Y = 50;
const AI_AREA_START_X = 0;
const AI_AREA_END_X = AI_AREA_START_X + CARD_WIDTH*INIT_HAND_SIZE;
const AI_AREA_START_Y = 900;
const AI_AREA_END_Y = AI_AREA_START_Y + CARD_HEIGHT;
const CTR_AREA_START_X = 300;
const CTR_AREA_END_X = CTR_AREA_START_X + CARD_WIDTH*TABLE_ROW_SIZE;
const CTR_AREA_START_Y = BG_HEIGHT/2-CARD_HEIGHT/2 - 50;
const PILE_AREA_START_X = 0;
const PILE_AREA_START_Y = 700;
const PILE_AREA_END_Y = PILE_AREA_START_Y + CARD_HEIGHT;
const DECK_X = 200;
const DECK_Y = BG_HEIGHT/2-CARD_HEIGHT/2;
const CARD_IMG_SRC = "../assets/rawcards.jpg";
const BG_IMG_SRC = "../assets/woodtexture.jpg";
const NUM_ALL_IMAGES = 2;


function init() {
    this.socket = io();
    //Is it possible for there to be a race condition
    this.socket.on('initGame', function(res) {
        gameState = initGame(res);
    });
    this.socket.on('update', function(res) {
        updateGameState(res);
        paintTable();
    });
    this.socket.on('keepalive', function() {
        //console.log('received keepalive');
        socket.emit('stillalive');
    });
}

function initGame(res) {
    updateGameState(res);
    canvas = document.getElementById("table");
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        loadImages();
    }
    canvas.addEventListener("click", onTableClick);
    // canvas.addEventListener("mouseover", onTableMouseover);
}

function updateGameState(res) {
    gameState = JSON.parse(res);
    hand = gameState['hand'];
    table = convertArrToDoubleArr(gameState['table'], TABLE_ROW_SIZE);
    deckSize = gameState['deckSize'];
    pile = gameState['pile'];
    points = gameState['points'];
    otherPlayers = gameState['otherPlayers'];
    activePlayerId = gameState['activePlayerId'];
}

function convertArrToDoubleArr(arr, rowSize) {
    return arr;
}

function paintGame() {
    paintBackground();
    paintDeck();
    paintTable();
    paintHand();
    paintOpponentHands();
    paintPile();
}

function paintBackground() {
    ctx.drawImage(bgImg, 0, 0, BG_WIDTH, BG_HEIGHT);
}

function paintTable()  {
    for (let i = 0; i < table.length; i++) {
        paintCard(table[i], CTR_AREA_START_X + (i%TABLE_ROW_SIZE)*CARD_WIDTH, 
            CTR_AREA_START_Y + Math.floor(i/TABLE_ROW_SIZE)*CARD_HEIGHT);
    }
}

function paintDeck() {
    paintCardBack(DECK_X, DECK_Y);
}

//Is it good practice to put this. in front of everything?
function paintHand() {
    for (let i = 0; i < hand.length; i++) {
        paintCard(hand[i], PLYR_AREA_START_X + i*CARD_WIDTH, PLYR_AREA_START_Y);
    }

    //Doing second for loop to draw the box on top of the cards
    for (let i = 0; i < hand.length; i++) {
        if (selectedCardIdx == i) {
            paintSelectBox(PLYR_AREA_START_X + i*CARD_WIDTH, PLYR_AREA_START_Y);
            break;
        }
    }
}

//Only handles one player for now
function paintOpponentHands() {
    otherPlayers.forEach(function(player) {
        for(let i = 0; i < player.handSize; i++) {
            paintCardBack(OPP_AREA_START_X + i*CARD_WIDTH, OPP_AREA_START_Y);
        }
    });
}

function paintPile() {
    for (let i = 0; i < pile.length; i++) {
        paintCard(pile[i], PILE_AREA_START_X + i*CARD_WIDTH, PILE_AREA_START_Y);
    }
}

function paintCard(card, x , y) {
    let month = card.month;
    if (isNotValidMonth(month)) {
        alert("paintCard(): invalid month " + month);
        return;
    }
    let cardNum = card.cardNum;
    if (isNotValidCardNum(cardNum)) {
        alert("paintCard(): invalid cardNum " + cardNum);
        return;
    }
    let imgPos = getImagePosition(month, cardNum);
    ctx.drawImage(cardImg, imgPos.x, imgPos.y, CARD_WIDTH, CARD_HEIGHT, x, y, CARD_WIDTH, CARD_HEIGHT);
}

function paintCardBack(x, y) {
    //Should I move this to init? And then add a comment for explanation?
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
}


function paintSelectBox(x, y) {
    ctx.strokeStyle = 'red';
    ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT);
}

function getImagePosition(month, cardNum) {
    let pos = {
        "x": X_OFFSET + (month-1)*CARD_WIDTH,
        "y": Y_OFFSET + (cardNum-1)*CARD_HEIGHT
    };
    return pos;
}

function loadImages() {
    numImagesLoaded = 0;
    cardImg = new Image();
    cardImg.src = CARD_IMG_SRC;
    cardImg.onload = waitForAllLoadsFinished;
    bgImg = new Image();
    bgImg.src = BG_IMG_SRC;
    bgImg.onload = waitForAllLoadsFinished;
}

function waitForAllLoadsFinished() {
    numImagesLoaded++;
    if (numImagesLoaded === NUM_ALL_IMAGES) {
        paintGame();
    }
}

function onTableClick(event)
{
    let canvasRect = canvas.getBoundingClientRect();
    let x = event.clientX - canvasRect.left;
    let y = event.clientY - canvasRect.top;
    
    if (isMyTurn()) {
        if (insidePlayerArea(x, y)) {
            selectedCardIdx = getSelectedCardIdx(x);
            paintGame();
        }
        
        if (selectedCardIdx != null &&
            insideCenterArea(x, y)) {
                let tableSelectedCardIdx = getSelectedTableCardIdx(x, y);
                if (matches(hand[selectedCardIdx], table[tableSelectedCardIdx])) {
                    matchCards(selectedCardIdx, tableSelectedCardIdx);
                }
            selectedCardIdx = null;
        }
    }
}

function getSelectedCardIdx(x) {
    return Math.floor((x-PLYR_AREA_START_X)/CARD_WIDTH);
}

function getSelectedTableCardIdx(x, y) {
    return Math.floor((x-CTR_AREA_START_X)/CARD_WIDTH);
}

function matches(card1, card2)
{
    //should use prototype and define equals function
    return card1.month === card2.month;
}

function matchCards(selectedIdx, tableSelectedCardIdx)
{
    this.socket.emit('match', selectedIdx, tableSelectedCardIdx);
}

function isMyTurn() {
    return activePlayerId === this.socket.id; 
}

function insidePlayerArea(x, y) {
    return insideArea(x, y, PLYR_AREA_START_X, PLYR_AREA_END_X, PLYR_AREA_START_Y, PLYR_AREA_END_Y);
}

function insideCenterArea(x, y) {
    let ctrAreaEndY = CTR_AREA_START_Y + Math.floor(table.length/TABLE_ROW_SIZE)*CARD_HEIGHT;
    return insideArea(x, y, CTR_AREA_START_X, CTR_AREA_END_X, CTR_AREA_START_Y, ctrAreaEndY);
}

function insideArea(x, y, startX, endX, startY, endY) {
    return (x >= startX && x <= endX && 
           y >= startY && y <= endY);
}

function isNotValidMonth(month) {
    return month < 1 || month > 12;
}

function isNotValidCardNum(cardNum) {
    return cardNum < 1 || cardNum > 4;
}
