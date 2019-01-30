var cardImg;
var canvas;
var ctx;
var hand;
var otherHands;
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

const INIT_HAND_SIZE = 8;
const INIT_TABLE_SIZE = 8;
const X_OFFSET = 45;
const Y_OFFSET = 85;
const CARD_HEIGHT = 190;
const CARD_WIDTH = 125;
const CARD_IMG_HEIGHT = 928;
const CARD_IMG_WIDTH = 1600;
const PLYR_AREA_START_X = 0;
const PLYR_AREA_END_X = PLYR_AREA_START_X + CARD_WIDTH*INIT_HAND_SIZE;
const PLYR_AREA_START_Y = 0;
const PLYR_AREA_END_Y = PLYR_AREA_START_Y + CARD_HEIGHT;
const AI_AREA_START_X = 0;
const AI_AREA_END_X = AI_AREA_START_X + CARD_WIDTH*INIT_HAND_SIZE;
const AI_AREA_START_Y = 900;
const AI_AREA_END_Y = AI_AREA_START_Y + CARD_HEIGHT;
const CTR_AREA_START_X = 300;
const CTR_AREA_END_X = CTR_AREA_START_X + CARD_WIDTH*INIT_TABLE_SIZE;
const CTR_AREA_START_Y = 400;
const CTR_AREA_END_Y = CTR_AREA_START_Y + CARD_HEIGHT;
const PILE_AREA_START_X = 0;
const PILE_AREA_START_Y = 700;
const PILE_AREA_END_Y = PILE_AREA_START_Y + CARD_HEIGHT;
const CARD_IMG_SRC = "../assets/rawcards.jpg";


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
        cardImg = new Image();
        cardImg.src = CARD_IMG_SRC;
        cardImg.onload = paintGame;
    }
    canvas.addEventListener("click", onTableClick);
    // canvas.addEventListener("mouseover", onTableMouseover);
}

function updateGameState(res) {
    gameState = JSON.parse(res);
    hand = gameState['hand'];
    table = gameState['table'];
    deckSize = gameState['deckSize'];
    pile = gameState['pile'];
    points = gameState['points'];
    otherHands = gameState['otherHands'];
    activePlayerId = gameState['activePlayerId'];
}

function paintGame() 
{
    paintTable();
}

function paintTable()  
{
    paintHand(hand, INIT_HAND_SIZE, PLYR_AREA_START_Y, PLYR_AREA_START_Y);
    paintHand(table, INIT_TABLE_SIZE, CTR_AREA_START_X, CTR_AREA_START_Y);
    paintPile();
    
}

function paintHand(handArr, initSize, startX, startY) {
    for (let i = 0; i < initSize; i++) {
        if (i < handArr.length) {
            paintCard(handArr[i], startX + i*CARD_WIDTH, startY);
        } else {
            paintBlankCard(startX + i*CARD_WIDTH, startY);
        }
    }
}

function paintPile() {
    for (let i = 0; i < pile.length; i++) {
        paintCard(pile[i], PILE_AREA_START_X + i*CARD_WIDTH, PILE_AREA_START_Y);
    }
}

function paintCard(card, x , y) 
{
    var month = card.month;
    if (isNotValidMonth(month)) {
        alert("paintCard(): invalid month " + month);
        return;
    }
    var cardNum = card.cardNum;
    if (isNotValidCardNum(cardNum)) {
        alert("paintCard(): invalid cardNum " + cardNum);
        return;
    }
    ctx.drawImage(cardImg, X_OFFSET + (month-1)*CARD_WIDTH, Y_OFFSET + (cardNum-1)*CARD_HEIGHT, CARD_WIDTH, CARD_HEIGHT, x, y, CARD_WIDTH, CARD_HEIGHT);
}

function paintBlankCard(x, y) 
{
    //Should I move this to init? And then add a comment for explanation?
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
}

function onTableClick(event)
{
    console.log("table clicked");
    let x = event.clientX;
    let y = event.clientY;
    
    if (isMyTurn()) {
        if (insidePlayerArea(x, y)) {
            console.log("inside player area");
            selectedCardIdx = Math.floor((x-PLYR_AREA_START_X)/CARD_WIDTH);
        }
        
        if (selectedCardIdx != null &&
            insideCenterArea(x, y)) {
                console.log("inside table area");
                let tableSelectedCardIdx = Math.floor((x-CTR_AREA_START_X)/CARD_WIDTH);
                console.log(selectedCardIdx);
                console.log(tableSelectedCardIdx);
                console.log(hand[selectedCardIdx]);
                console.log(table[tableSelectedCardIdx]);
                if (matches(hand[selectedCardIdx], table[tableSelectedCardIdx])) {
                    matchCards(selectedCardIdx, tableSelectedCardIdx);
                }
            selectedCardIdx = null;
        }
    }
}

function matches(card1, card2)
{
    console.log("checking if matches");
    //should use prototype and define equals function
    return card1.month === card2.month;
}

function matchCards(selectedIdx, tableSelectedCardIdx)
{
    console.log("try to match");
    this.socket.emit('match', selectedIdx, tableSelectedCardIdx);
}

function isMyTurn() {
    console.log("is my turn?: " + activePlayerId + " ?" + this.socket.id);
    return activePlayerId === this.socket.id; 
}

// function playerDraws()
// {
//     addCardToHand(hand);
// }

// function aiDraws()
// {
//     addCardToHand(aiHand);
// }

// function addCardToHand(handArr)
// {
//     handArr.push(draw(1)[0]);
// }

// function changeTurn()
// {
//     isMyTurn = !isMyTurn;
// }

// /*Temporary code for AI to be implemented on server*/
// function doAITurn()
// {
//     for (let i = 0; i < table.length; i++) {
//         for (let j = 0; j < aiHand.length; j++) {
//             if (matches(aiHand[j], table[i])) {
//                 matchCardsAndUpdate(aiHand, j, i, aiPile);
//                 aiDraws();
//                 paintTable();
//                 return;
//             }
//         }
//     }
// }

// function onTableMouseover(event)
// {
//     var x = event.clientX;
//     var y = event.clientY;
// }

function insidePlayerArea(x, y) {
    return insideArea(x, y, PLYR_AREA_START_X, PLYR_AREA_END_X, PLYR_AREA_START_Y, PLYR_AREA_END_Y);
}

function insideCenterArea(x, y) {
    return insideArea(x, y, CTR_AREA_START_X, CTR_AREA_END_X, CTR_AREA_START_Y, CTR_AREA_END_Y);
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