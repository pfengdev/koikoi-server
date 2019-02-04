//Hanafuda is the name of the traditional Japanese set of playing cards
//that can be used to play KoiKoi and other games
let Card = require('./card.js');
let Utils = require('../utils/utils.js')

var Deck = function() {
    //How to define as property of the "class"?
    let that = this;
    const NUM_OF_MONTHS = 12;
    const NUM_OF_CARDS_PER_MONTH = 4;
    const INIT_DECK_SIZE = 48;
    this.deck = [];
    this.topIdx = 0;

    Deck.prototype.init = function() {
        for (let i = 1; i <= NUM_OF_MONTHS; i++) {
            for (let j = 1; j <= NUM_OF_CARDS_PER_MONTH; j++) {
                that.deck.push(new Card(i, j));
            }
        }
        that.topIdx = 0;
    }

    Deck.prototype.pop = function(numOfCards) {
        let cards = that.deck.slice(that.topIdx, that.topIdx+numOfCards);
        that.topIdx += numOfCards;
        return cards;
    }

    Deck.prototype.size = function() {
        return that.deck.length;
    }

    Deck.prototype.shuffle = function() {
        that.deck = Utils.shuffle(that.deck);
    }

    Deck.prototype.getInitDeckSize = function() {
        return INIT_DECK_SIZE;
    }
}

module.exports = Deck;