//Hanafuda is the name of the traditional Japanese set of playing cards
//that can be used to play KoiKoi and other games
let Card = require('./card.js');

var Deck = function() {
    //How to define as property of the "class"?
    var that = this;
    const NUM_OF_MONTHS = 12;
    const NUM_OF_CARDS_PER_MONTH = 4;
    const INIT_SIZE = 48;
    var deck = [];
    var topIdx = 0;

    var init = function() {
        for (let i = 1; i <= NUM_OF_MONTHS; i++) {
            for (let j = 1; j <= NUM_OF_CARDS_PER_MONTH; j++) {
                deck.push(new Card(i, j));
            }
        }
        topIdx = 0;
    }

    var pop = function(numOfCards) {
        let cards = deck.slice(topIdx, topIdx+numOfCards);
        topIdx += numOfCards;
        return cards;
    }

    var size = function() {
        return deck.length;
    }

    /*Knuth shuffle*/
    var shuffle = function() {
        let currIdx = deck.length;
        let swapIdx;
        let temp;
        while (currIdx > 0) {
            currIdx--;
            swapIdx = Math.floor(Math.random()*currIdx);
            temp = deck[currIdx];
            deck[currIdx] = deck[swapIdx];
            deck[swapIdx] = temp;
        }
        return deck;
    }

    return {
        init: init,
        pop: pop,
        size: size,
        shuffle: shuffle,
        INIT_SIZE: INIT_SIZE
    };
}

module.exports = Deck;