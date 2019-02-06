var PlayerRenderer = function(handRenderer, pileRenderer, pointsRenderer) {
	var that = this;

	this.handRenderer = handRenderer;
	this.pileRenderer = pileRenderer;
	this.pointsRenderer = pointsRenderer;

	var render = function(ctx, player, faceDown) {
		that.handRenderer.render(ctx, player.hand, faceDown);
		that.pileRenderer.render(ctx, player.pile);
		that.pointsRenderer.render(ctx, player.points);
	}

	return {
		render : render
	};
}