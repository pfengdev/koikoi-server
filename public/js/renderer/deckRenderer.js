var DeckRenderer = function(cardRenderer, x, y) {
	var that = this;

	this.cardRenderer = cardRenderer;
	this.START_X = x;
	this.START_Y = y;

	var render = function(ctx, x, y, topCard) {
		if (topCard) {
			that.cardRenderer.renderFaceUp(ctx, that.START_X, that.START_Y, card);
		} else {
			that.cardRenderer.renderFaceDown(ctx, that.START_X, that.START_Y);
		}
	}
	
	return {
		render : render
	};
}