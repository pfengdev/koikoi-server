var Card = function(month, cardNum) {
	this.month = month;
	this.cardNum = cardNum;
	//setter, getter
	//what is the scope of the month/cardNum i'm returning
	return {
		month : that.month,
		cardNum : that.cardNum
	};
}