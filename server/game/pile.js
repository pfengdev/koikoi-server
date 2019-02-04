let Card = require('../hanafuda/card.js');

var Pile = function() {
	let that = this;
	this.cards = [];
	//Minimum number of plain cards to score a point
	this.PLAIN_MIN = 10;
	this.ANIMAL_MIN = 5;
	this.RIBBON_MIN = 5;
	this.SPC_RIBBON_MIN = 3;
	this.SPC_RIBBON_POINTS = 6;
	this.INO_SHIKA_CHO_POINTS = 5;

	Pile.prototype.push = function(newCards) {
		newCards.forEach(function(newCard) {
			cards.push(newCard);
		});
	}

	Pile.prototype.getPoints = function() {
		let points = 0;
		let cardTypes = countCardTypes();
		points += calculatePlains(cardTypes.plain);
		points += calculateAnimals(cardTypes.animal);
		points += calculateRibbons(cardTypes.ribbon);
		points += calculateSpecialRibbons(cardTypes.blueRibbon);
		points += calculateSpecialRibbons(cardTypes.poetryRibbon);
		points += calculateInoShikaCho(cardTypes.inoShikaCho);
		points += calculateBrights(cardTypes.bright, cardTypes.rainMan);
		return points;
	}

	Pile.prototype.countCardTypes = function() {
		let plain = 0;
		let ribbon = 0;
		let poetryRibbon = 0;
		let blueRibbon = 0;
		let animal = 0;
		let inoShikaChoCtr = 0;
		let inoShikaCho = false;
		let bright = 0;
		let rainMan = false;

		that.cards.forEach(function(card) {
			if (card.cardType === card.PLAIN) {
				plain++;
			} else if (card.cardType === card.POETRY_RIBBON) {
				poetryRibbon++;
			} else if (card.cardType === card.BLUE_RIBBON) {
				blueRibbon++;
			} else if (card.cardType === card.ANIMAL) {
				animal++;
			} else if (card.cardType === card.BRIGHT) {
				bright++;
			}

			if (card.isRainMan()) {
				rainMan = true;
			}

			if (card.isIno() || card.isShika() || card.isCho()) {
				inoShikaChoCtr++;
			}

			if (inoShikaChoCtr === 3) {
				inoShikaCho = true;
			}

			if (card.isRibbon()) {
				ribbon++;
			}
		});
		return {
			"plain": plain,
			"ribbon": ribbon,
			"poetryRibbon": poetryRibbon,
			"blueRibbon": blueRibbon,
			"animal": animal,
			"inoShikaCho": inoShikaCho,
			"bright": bright,
			"rainMan": rainMan
		};
	}

	Pile.prototype.calculatePlains = function(num) {
		return calculateGeneric(num, PLAIN_MIN);
	}

	Pile.prototype.calculateAnimals = function(num) {
		return calculateGeneric(num, ANIMAL_MIN);
	}

	Pile.prototype.calculateGeneric = function(num, min) {
		let points = 0;
		if (num >= min) {
			points++;
		}
		points += num-min;
		return points;
	}

	Pile.prototype.calculateRibbons = function(num) {
		calculateGeneric(num, RIBBON_MIN);
	}

	Pile.prototype.calculateSpecialRibbons = function(num) {
		if (num === SPC_RIBBON_MIN) {
			return SPC_RIBBON_POINTS;
		}
		return 0;
	}

	Pile.prototype.calculateBrights = function(num, rainMan) {
		if (num === 5) {
			return 15;
		} else if (num === 4 && !rainMan) {
			return 10;
		} else if(num === 4) {
			return 8;
		} else if (num === 3 && !rainMan) {
			return 6;
		}
	}

	Pile.prototype.calculateInoShikaCho = function(inoShikaCho) {
		return inoShikaCho ? INO_SHIKA_CHO_POINTS : 0;
	}

	Pile.prototype.toArray = function() {
		return that.cards;
	}
}

module.exports = Pile;