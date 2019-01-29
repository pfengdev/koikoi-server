var cardImg;
var canvas;
var ctx;
var hand;
var aiHand;
var table;
var pile;
var aiPile;
var selectedCardIdx;
var points;
//The thinking is that an array of player ids is maintained and the turnIdx is incremented then modulo the length of the players array.
//This will return the id of the player whose turn it is, then you only need to compare to your known value to know if it is your turn or not
//But then maybe it should be handled by the server.
//var players;
//var turnIdx;
var isMyTurn;

const X_OFFSET = 45;
const Y_OFFSET = 85;
const CARD_HEIGHT = 190;
const CARD_WIDTH = 125;
const CARD_IMG_HEIGHT = 928;
const CARD_IMG_WIDTH = 1600;
const INIT_HAND_SIZE = 8;
const INIT_AI_HAND_SIZE = 8;
const INIT_NUM_CARDS_TABLE = 8;
const PLYR_AREA_START_X = 0;
const PLYR_AREA_END_X = PLYR_AREA_START_X + CARD_WIDTH*INIT_HAND_SIZE;
const PLYR_AREA_START_Y = 0;
const PLYR_AREA_END_Y = PLYR_AREA_START_Y + CARD_HEIGHT;
const AI_AREA_START_X = 0;
const AI_AREA_END_X = AI_AREA_START_X + CARD_WIDTH*INIT_HAND_SIZE;
const AI_AREA_START_Y = 900;
const AI_AREA_END_Y = AI_AREA_START_Y + CARD_HEIGHT;
const CTR_AREA_START_X = 300;
const CTR_AREA_END_X = CTR_AREA_START_X + CARD_WIDTH*INIT_NUM_CARDS_TABLE;
const CTR_AREA_START_Y = 400;
const CTR_AREA_END_Y = CTR_AREA_START_Y + CARD_HEIGHT;
const PILE_AREA_START_X = 0;
const PILE_AREA_START_Y = 700;
const PILE_AREA_END_Y = PILE_AREA_START_Y + CARD_HEIGHT;
const CARD_IMG_SRC = "../assets/rawcards.jpg";

function init() 
{
    canvas = document.getElementById("table");
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        cardImg = new Image();
        cardImg.src = CARD_IMG_SRC;
        cardImg.onload = paintGame;
    }
    initDeck();
    shuffleDeck();
    hand = draw(INIT_HAND_SIZE);
    aiHand = draw(INIT_AI_HAND_SIZE);
    table = draw(INIT_NUM_CARDS_TABLE);
    pile = [];
    aiPile = [];
    points = 0;
    isMyTurn = true;
    canvas.addEventListener("click", onTableClick);
    canvas.addEventListener("mouseover", onTableMouseover);
}

function paintGame() 
{
    paintTable();
}

function paintTable()  
{
    paintHand(hand, INIT_HAND_SIZE, PLYR_AREA_START_Y, PLYR_AREA_START_Y);
    paintHand(table, INIT_NUM_CARDS_TABLE, CTR_AREA_START_X, CTR_AREA_START_Y);
    paintHand(aiHand, INIT_AI_HAND_SIZE, AI_AREA_START_X, AI_AREA_START_Y);
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
    let x = event.clientX;
    let y = event.clientY;
    
    if (insidePlayerArea(x, y) && isMyTurn) {
        selectedCardIdx = Math.floor((x-PLYR_AREA_START_X)/CARD_WIDTH);
    }
    
    if (selectedCardIdx != null &&
        insideCenterArea(x, y)) {
            let tableSelectedCardIdx = Math.floor((x-CTR_AREA_START_X)/CARD_WIDTH);
            if (matches(hand[selectedCardIdx], table[tableSelectedCardIdx])) {
                console.log("matchCards");
                matchCardsAndUpdate(hand, selectedCardIdx, tableSelectedCardIdx, pile);
                playerDraws();
                updatePoints();
                paintTable();
                doAITurn();
            }
        selectedCardIdx = null;
    }
}

function matches(card1, card2)
{
    //should use prototype and define equals function
    return card1.month === card2.month;
}

function matchCardsAndUpdate(handArr, selectedIdx, tableSelectedCardIdx, pileArr)
{
    console.log(selectedIdx);
    matchCards(handArr, selectedIdx, tableSelectedCardIdx, pileArr);
    changeTurn();
}

function matchCards(handArr, selectedIdx, tableSelectedCardIdx, pileArr)
{
    pileArr.push(handArr[selectedIdx]);
    pileArr.push(table[tableSelectedCardIdx]);
    handArr.splice(selectedIdx, 1);
    table.splice(tableSelectedCardIdx, 1);
}

function updatePoints() 
{
    points += 2;
}

function playerDraws()
{
    addCardToHand(hand);
}

function aiDraws()
{
    addCardToHand(aiHand);
}

function addCardToHand(handArr)
{
    handArr.push(draw(1)[0]);
}

function changeTurn()
{
    isMyTurn = !isMyTurn;
}

/*Temporary code for AI to be implemented on server*/
function doAITurn()
{
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < aiHand.length; j++) {
            if (matches(aiHand[j], table[i])) {
                matchCardsAndUpdate(aiHand, j, i, aiPile);
                aiDraws();
                paintTable();
                return;
            }
        }
    }
}

function onTableMouseover(event)
{
    var x = event.clientX;
    var y = event.clientY;
}

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

/*Temporary placeholder code for server code*/
const NUM_OF_MONTHS = 12;
const NUM_OF_CARDS_PER_MONTH = 4;
var deck;
var topIdx;

function Card(month, cardNum) {
    this.month = month;
    this.cardNum = cardNum;
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
function shuffleDeck() {
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
}

function draw(numOfCards) {
    topIdx += numOfCards;
    return deck.slice(topIdx-numOfCards, topIdx);
}