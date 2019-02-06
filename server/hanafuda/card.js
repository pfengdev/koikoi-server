var Card = function(month, cardNum) {
	//Is there a way to mimic private enum?
	const POETRY_RIBBON = "Poetry Ribbon";
    const RED_RIBBON = "Red Ribbon";
    const BLUE_RIBBON = "Blue Ribbon";
    const ANIMAL = "Animal";
    const BRIGHT = "Bright";
    const PLAIN = "Plain";
    var month = month;
    var cardNum = cardNum;
    var cardType = determineCardType();

    function determineCardType() {
    	if (month >= 1 && month <= 3 && cardNum === 2) {
    		cardType = POETRY_RIBBON;
    	} else if ((month === 4 || month === 5 || month === 7) && cardNum === 2 ||
    				(month === 11 && cardNum === 3)) {
    		cardType = RED_RIBBON;
    	} else if ((month === 6 || month === 9 || month === 10) && cardNum === 2){
    		cardType = BLUE_RIBBON;
    	} else if ((month === 2 || (month >= 4 && month <= 7) || month === 9 || month === 10) && cardNum === 1 ||
    				((month === 11 || month === 8) && cardNum === 2)) {
    		cardType = ANIMAL;
    	} else if ((month === 1 || month === 3 || month === 8 || month === 11 || month === 12) && cardNum === 1) {
    		cardType = BRIGHT;
    	} else {
    		cardType = PLAIN;
    	}
    }
    
    var getCardType = function() {
    	return cardType;
    }

    var getMonth = function() {
    	return month;
    }

    var getCardNum = function() {
    	return cardNum;
    }

    //make static
    var isIno = function() {
    	return month === 7 && cardNum === 1;
    }

    var isShika = function() {
    	return month === 10 && cardNum === 1;
    }

    var isCho = function() {
    	return month === 6 && cardNum === 1;
    }

    var isRibbon = function() {
    	return cardType === BLUE_RIBBON || cardType === RED_RIBBON ||
    		cardType === POETRY_RIBBON;
    }

    var isRainMan = function() {
    	return month === 11 && cardNum === 1;
    }

    //hide implementation i.e. have some toJson for client side
    return {
    	getCardType : getCardType,
    	month : month,
    	cardNum : cardNum,
    	isIno : isIno,
    	isShika : isShika,
    	isCho : isCho,
    	isRibbon : isRibbon,
    	isRainMan : isRainMan,
    	PLAIN : PLAIN,
    	POETRY_RIBBON : POETRY_RIBBON,
    	RED_RIBBON : RED_RIBBON,
    	BLUE_RIBBON : BLUE_RIBBON,
    	ANIMAL : ANIMAL,
    	BRIGHT : BRIGHT
    };
}

module.exports = Card;