var CardRenderer = function() {
	var that = this;
	const JANUARY = 1;
	const DECEMBER = 12;
	const MIN_CARD_NUM = 1;
	const MAX_CARD_NUM = 4;
	const CARD_BACK_FILL_STYLE = 'black';
	const IMG_SRC = "../../assets/rawcards.jpg";
	var img;

	function isValidMonth(month) {
    	return month >= JANUARY && month <= DECEMBER;
	}

	function isValidCardNum(cardNum) {
	    return cardNum >= MIN_CARD_NUM && cardNum <= MAX_CARD_NUM;
	}

	function getImagePosition(card) {
	    let pos = {
	        "x": CARD_X_OFFSET + (card.month-1)*CARD_WIDTH,
	        "y": CARD_Y_OFFSET + (card.cardNum-1)*CARD_HEIGHT
	    };
	    return pos;
	}

	var loadImages = function(onLoad) {
		img = new Image();
		img.src = IMG_SRC;
		img.onload = onLoad;
	}

	var renderFaceDown = function(ctx, x, y) {
		ctx.fillStyle = CARD_BACK_FILL_STYLE;
	    ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
	}

	var renderFaceUp = function(ctx, x, y, card) {
		if (isValidMonth(card.month) && isValidCardNum(card.cardNum)) {
		    let imgPos = getImagePosition(card);
			ctx.drawImage(img, imgPos.x, imgPos.y, CARD_WIDTH, CARD_HEIGHT, x, y, CARD_WIDTH, CARD_HEIGHT);
		} else {
			//handle error
		}
	}	

	return {
		renderFaceUp : renderFaceUp,
		renderFaceDown : renderFaceDown,
		loadImages : loadImages
	};
}