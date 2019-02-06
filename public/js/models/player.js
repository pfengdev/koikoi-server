var Player = function(hand, pile, points) {
	var that = this;
	this.hand = hand;
	this.pile = pile;
	this.points = points;

	return {
		hand : that.hand,
		pile : that.pile,
		points : that.points
	}
}