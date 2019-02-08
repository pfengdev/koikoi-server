var Renderer = function(ctx) {
	var that = this;
	const NUM_ALL_IMAGES = 2;
	var numImagesLoaded = 0;
	var isImagesLoaded = false;
	
	//When to use this over var? Make this change everywhere
	//Init. This looks weird even tho it's a constructor init. Is there a better way?
	this.ctx = ctx;
	this.players = {};
	this.table = [];
	this.topCard = null;
	this.cardRenderer = new CardRenderer();
	this.tableRenderer = new TableRenderer(this.cardRenderer, TABLE_START_X, TABLE_START_Y);
	this.backgroundRenderer = new BackgroundRenderer(this.cardRenderer);
	this.deckRenderer = new DeckRenderer(this.cardRenderer, DECK_START_X, DECK_START_Y);
	this.id;
	this.playerToRenderer = {};

	//TODO: Don't like this
	function initPlayerRenderers() {
		//For the current player
		let handRenderer = new HandRenderer(that.cardRenderer, HAND_START_X, HAND_START_Y);
		let pileRenderer = new PileRenderer(that.cardRenderer, PILE_START_X, PILE_START_Y);
		let pointsRenderer = new PointsRenderer(POINTS_START_X, POINTS_START_Y);
		let playerRenderer = new PlayerRenderer(handRenderer, pileRenderer, pointsRenderer);

		//For the other players
		let oppHandRenderer = new HandRenderer(that.cardRenderer, OPP_HAND_START_X, OPP_HAND_START_Y);
		let oppPileRenderer = new PileRenderer(that.cardRenderer, OPP_PILE_START_X, OPP_PILE_START_Y);
		let oppPointsRenderer = new PointsRenderer(OPP_POINTS_START_X, OPP_POINTS_START_Y);
		let oppPlayerRenderer = new PlayerRenderer(oppHandRenderer, oppPileRenderer, oppPointsRenderer);

		Object.keys(that.players).forEach(function(plyrId) {
			if (that.id === plyrId) {
				that.playerToRenderer[plyrId] = playerRenderer;
			} else {
				that.playerToRenderer[plyrId] = oppPlayerRenderer;
			}
		});
	}

    //This can be turned into a curried function that does asynchronous loading
	function waitForAllLoadsFinished () {
	    numImagesLoaded++;
	    if (numImagesLoaded === NUM_ALL_IMAGES) {
	    	isImagesLoaded = true;
	    	render();
	    }
	}

	function loadImagesAndRender() {
	    that.cardRenderer.loadImages(waitForAllLoadsFinished);
	    that.backgroundRenderer.loadImages(waitForAllLoadsFinished);
	}

	var render = function() {
		if (!isImagesLoaded) {
			loadImagesAndRender();
		} else {
			that.backgroundRenderer.render(that.ctx);
			let faceDown;
			Object.keys(that.players).forEach(function(plyrId) {
				faceDown = (that.id !== plyrId);
				that.playerToRenderer[plyrId].render(that.ctx, that.players[plyrId], faceDown);
			});
			that.tableRenderer.render(that.ctx, that.table);
			that.deckRenderer.render(that.ctx, that.topCard);
		}
	}

	var insideHand = function(x, y) {
		return that.handRenderer.insideArea(x, y, that.hand);
	}

	var insideTable = function(x, y) {
		return that.tableRenderer.insideArea(x, y, that.table);
	}

	var getHandIdx = function(x) {
		return that.handRenderer.getHandIdx(x);
	}

	var getTableIdx = function(x, y) {
		return tableRenderer.getIdx(x, y);
	}

	var setTable = function(table) {
		that.table = table;
	}

	var setId = function(id) {
		that.id = id;
	}

	var setTopCard = function(topCard) {
		that.topCard = topCard;
	}

	return {
		render : render,
		insideHand : insideHand,
		insideTable : insideTable,
		players : that.players,
		setTopCard : setTopCard,
		setId : setId,
		setTable : setTable,
		//also remove this if change
		initPlayerRenderers : initPlayerRenderers
	};
}