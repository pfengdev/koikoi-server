var PointsRenderer = function(x, y) {
	var that = this;
	const FONT = '30px Arial';
	const FILL_STYLE = 'white';
	this.START_X = x;
	this.START_Y = y;

	var render = function(ctx, points) {
		ctx.fillStyle = FILL_STYLE;
	    ctx.font = FONT;
	    ctx.fillText(points.total, that.START_X, that.START_Y);
	}

	return {
		render : render
	};
}