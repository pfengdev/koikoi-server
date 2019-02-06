var TableRenderer = function(cardRenderer, x, y) {
	CardArrayRenderer.call(this, cardRenderer, x, y);
	this.END_Y = this.getStartY() + TABLE_COL_SIZE*CARD_HEIGHT;
}

TableRenderer.prototype = Object.create(CardArrayRenderer.prototype);

TableRenderer.prototype._getCardPosition = function(i) {
	return { "x" : this.getStartX() + Math.floor(i/TABLE_COL_SIZE)*CARD_WIDTH,
			 "y" : this.getStartY() + Math.floor(i%TABLE_COL_SIZE)*CARD_HEIGHT};
}

TableRenderer.prototype.insideArea = function(x, y, cardArr) {
	let isInside = false;
    let tableRowSize = Math.floor(table.length/TABLE_COL_SIZE);
    let endX = this.getStartX() + tableRowSize*CARD_WIDTH;
    if (cardArr.length == 1) {
        isInside = utils.insideArea(x, y, this.getStartX(), endX, this.getStartY(), this.getStartY() + CARD_HEIGHT);
    }
    else if (cardArr.length % 2 == 0) {
        //Checking if event was within the rectangular area
        isInside = utils.insideArea(x, y, this.getStartX(), endX, this.getStartY(), END_Y);
    } else {
        //For odd number of cards, checking if event is within rectangular area + the extra card
        isInside = utils.insideArea(x, y, this.getStartX(), endX, this.getStartY(), END_Y) ||
                    utils.insideArea(x, y, endX, endX + CARD_WIDTH, this.getStartY(), this.getStartY() + CARD_HEIGHT);
    }
    return isInside;
}

TableRenderer.prototype.getIndex = function(x, y) {
    let idx = Math.floor((x-this.getStartX())/CARD_WIDTH)*TABLE_COL_SIZE;
    idx = Math.floor((y-this.getStartY())/CARD_HEIGHT)==0 ? idx : idx+1;
    return idx;
}
