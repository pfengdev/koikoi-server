var CardArrayRenderer = function(cardRenderer, x, y) {
	this.cardRenderer = cardRenderer;
	this.START_X = x;
	this.START_Y = y;
}

CardArrayRenderer.prototype = {
	constructor: CardArrayRenderer,
	_getCardPosition : function(i) {
		/*TODO: Wish there was a way to really make this private.
		Maybe mix with module pattern?*/
		/*Override in subclasses*/
	},
	render : function(ctx, cardArr, faceDown) {
		for (let i = 0; i < cardArr.length; i++) {
			let card = cardArr[i];
			let pos = this._getCardPosition(i);
			if (faceDown) {
				this.cardRenderer.renderFaceDown(ctx, pos.x, pos.y);
			} else {
				this.cardRenderer.renderFaceUp(ctx, pos.x, pos.y, card);
			}
		}
	},
	insideArea : function(x, y, cardArr) {
		/*Override in subclass*/
	},
	getIndex : function(x, y) {
		/*Override in subclass*/
	},
	getStartX : function() {
		return this.START_X;
	},
	getStartY : function() {
		return this.START_Y;
	}
}