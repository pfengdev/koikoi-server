//Hanafuda is the name of the traditional Japanese set of playing cards
//that can be used to play KoiKoi and other games
let Card = require('./card.js');
let Utils = require('../utils/utils.js')

var Deck = function() {
    //How to define as property of the "class"?
    const NUM_OF_MONTHS = 12;
    const NUM_OF_CARDS_PER_MONTH = 4;
    const INIT_DECK_SIZE = 48;
    let deck = [];
    let topIdx = 0;

    Deck.prototype.init = function() {
        for (let i = 1; i <= NUM_OF_MONTHS; i++) {
            for (let j = 1; j <= NUM_OF_CARDS_PER_MONTH; j++) {
                deck.push(new Card(i, j));
            }
        }
        topIdx = 0;
    }

    Deck.prototype.pop = function(numOfCards) {
        let cards = deck.slice(topIdx, topIdx+numOfCards);
        topIdx += numOfCards;
        return cards;
    }

    Deck.prototype.size = function() {
        return deck.length;
    }

    Deck.prototype.shuffle = function() {
        deck = Utils.shuffle(deck);
    }
}

module.exports = Deck;