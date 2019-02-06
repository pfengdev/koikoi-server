var BackgroundRenderer = function() {
	const POS_X = 0;
	const POS_Y = 0;

	const IMG_SRC = "../../assets/woodtexture.jpg";
	var img;

	var loadImages = function(onLoad) {
		img = new Image();
		img.src = IMG_SRC;
		img.onload = onLoad;
	}

	var render = function(ctx) {
		ctx.drawImage(img, POS_X, POS_Y, BG_WIDTH, BG_HEIGHT);
	}

	return {
		render : render,
		loadImages : loadImages
	};
}