var HandRenderer = function(cardRenderer, x, y) {
	CardArrayRenderer.call(this, cardRenderer, x, y);
	this.selectedCardIdx = -1;
	this.END_Y = this.getStartY() + CARD_HEIGHT;

	// function renderSelectBox(x, y) {
	//     ctx.strokeStyle = 'red';
	//     ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT);
	// }


	// function setSelectedCardIdx(idx) {
	// 	this.selectedCardIdx = idx;
	// }

	// function clearSelectedCardIdx() {
	// 	this.selectedCardIdx = -1;
	// }

}

HandRenderer.renderSelectBox = function(x, y) {
    ctx.strokeStyle = 'red';
    ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT);
}


HandRenderer.setSelectedCardIdx = function(idx) {
	this.selectedCardIdx = idx;
}

HandRenderer.clearSelectedCardIdx = function() {
	this.selectedCardIdx = -1;
}

HandRenderer.prototype = Object.create(CardArrayRenderer.prototype);

HandRenderer.prototype.constructor = HandRenderer;

HandRenderer.prototype._getCardPosition = function(i) {
	return { "x" : this.getStartX() + i*CARD_WIDTH,
			 "y" : this.getStartY()};
}

HandRenderer.prototype.render = function(ctx, cardArr, faceDown) {
	CardArrayRenderer.prototype.render.call(this, ctx, cardArr, faceDown);
    //this.renderSelectBox(this.getStartX() + this.selectedCardIdx*CARD_WIDTH, this.getStartY());
}

HandRenderer.prototype.insideArea = function(x, y, cardArr) {
	let endX = this.getStartX() + CARD_WIDTH*cardArr.length;
    return utils.insideArea(x, y, this.getStartX(), endX, this.getStartY(), END_Y);
}

HandRenderer.prototype.getIndex = function(x) {
    return Math.floor((x-this.getStartX())/CARD_WIDTH);
}
