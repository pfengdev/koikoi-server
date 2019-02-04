	var Card = function(month, cardNum) {
		let that = this;
	    this.month = month;
	    this.cardNum = cardNum;
	    this.cardType = null;
	    //how to make this const
	    this.POETRY_RIBBON = "Poetry Ribbon";
	    this.RED_RIBBON = "Red Ribbon";
	    this.BLUE_RIBBON = "Blue Ribbon";
	    this.ANIMAL = "Animal";
	    this.BRIGHT = "Bright";
	    this.PLAIN = "Plain";


	    //Is there a way to mimic private enum?
	    //make a private function?
	    Card.prototype.getCardType = function(month, cardNum) {
	    	if (cardType == null) {
		    	if (month >= 1 && month <= 3 && cardNum === 2) {
		    		cardType = that.POETRY_RIBBON;
		    	} else if ((month === 4 || month === 5 || month === 7) && cardNum === 2 ||
		    				(month === 11 && cardNum === 3)) {
		    		cardType = that.RED_RIBBON;
		    	} else if ((month === 6 || month === 9 || month === 10) && cardNum === 2){
		    		cardType = that.BLUE_RIBBON;
		    	} else if ((month === 2 || (month >= 4 && month <= 7) || month === 9 || month === 10) && cardNum === 1 ||
		    				((month === 11 || month === 8) && cardNum === 2)) {
		    		cardType = that.ANIMAL;
		    	} else if ((month === 1 || month === 3 || month === 8 || month === 11 || month === 12) && cardNum === 1) {
		    		cardType = that.BRIGHT;
		    	} else {
		    		cardType = that.PLAIN;
		    	}
	    	}
	    	return cardType;
	    }

	    Card.prototype.isIno = function(month, cardNum) {
	    	return month === 7 && cardNum === 1;
	    }

	    Card.prototype.isShika = function(month, cardNum) {
	    	return month === 10 && cardNum === 1;
	    }

	    Card.prototype.isCho = function(month, cardNum) {
	    	return month === 6 && cardNum === 1;
	    }

	    Card.prototype.isRibbon = function(month, cardNum) {
	    	return that.cardType === that.BLUE_RIBBON || that.cardType === that.RED_RIBBON ||
	    		that.cardType === that.POETRY_RIBBON;
	    }

	    Card.prototype.isRainMan = function(month, cardNum) {
	    	return month === 11 && cardNum === 1;
	    }
	}

	module.exports = Card;