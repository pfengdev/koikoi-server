var PileRenderer = function(cardRenderer, x, y) {
	CardArrayRenderer.call(this, cardRenderer, x, y);
}

PileRenderer.prototype = Object.create(CardArrayRenderer.prototype);

PileRenderer.prototype._getCardPosition = function(i) {
	/*TODO: Display cards as yakus*/
	return { "START_X" : this.getStartX() + i*CARD_WIDTH,
			 "START_Y" : this.getStartY()};
}
