//how to make static class?
let Card = require('../hanafuda/card.js');

var PointCalc = function() {
	//Minimum number of plain cards to score a point
	let that = this;
	this.PLAIN_MIN = 10;
	this.ANIMAL_MIN = 5;
	this.RIBBON_MIN = 5;
	this.SPC_RIBBON_MIN = 3;
	this.SPC_RIBBON_POINTS = 6;
	this.INO_SHIKA_CHO_POINTS = 5;

	PointCalc.prototype.calculate = function(cards) {
		let value = {};
		let cardTypes = PointCalc.prototype.countCardTypes(cards);
		value["plain"] = PointCalc.prototype.calculatePlains(cardTypes.plain);
		value["animal"] = PointCalc.prototype.calculateAnimals(cardTypes.animal);
		value["ribbon"] = PointCalc.prototype.calculateRibbons(cardTypes.ribbon);
		value["blueRibbon"] = PointCalc.prototype.calculateSpecialRibbons(cardTypes.blueRibbon);
		value["poetryRibbon"] = PointCalc.prototype.calculateSpecialRibbons(cardTypes.poetryRibbon);
		value["inoShikaCho"] = PointCalc.prototype.calculateInoShikaCho(cardTypes.inoShikaCho);
		value["bright"] = PointCalc.prototype.calculateBrights(cardTypes.bright, cardTypes.rainMan);
		value["total"] = 0;
		Object.keys(value).forEach(function(type) {
			if (type !== "total") {
				value["total"] += value[type];
			}
		});
		return value;
	}

	PointCalc.prototype.countCardTypes = function(cards) {
		let plain = 0;
		let ribbon = 0;
		let poetryRibbon = 0;
		let blueRibbon = 0;
		let animal = 0;
		let inoShikaChoCtr = 0;
		let inoShikaCho = false;
		let bright = 0;
		let rainMan = false;

		cards.forEach(function(card) {
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

	PointCalc.prototype.calculatePlains = function(num) {
		return PointCalc.prototype.calculateGeneric(num, that.PLAIN_MIN);
	}

	PointCalc.prototype.calculateAnimals = function(num) {
		return PointCalc.prototype.calculateGeneric(num, that.ANIMAL_MIN);
	}

	PointCalc.prototype.calculateGeneric = function(num, min) {
		let points = 0;
		if (num >= min) {
			points = points + num-min + 1;
		}
		return points;
	}

	PointCalc.prototype.calculateRibbons = function(num) {
		return PointCalc.prototype.calculateGeneric(num, that.RIBBON_MIN);
	}

	PointCalc.prototype.calculateSpecialRibbons = function(num) {
		if (num === that.SPC_RIBBON_MIN) {
			return that.SPC_RIBBON_POINTS;
		}
		return 0;
	}

	PointCalc.prototype.calculateBrights = function(num, rainMan) {
		if (num === 5) {
			return 15;
		} else if (num === 4 && !rainMan) {
			return 10;
		} else if(num === 4) {
			return 8;
		} else if (num === 3 && !rainMan) {
			return 6;
		}
		return 0;
	}

	PointCalc.prototype.calculateInoShikaCho = function(inoShikaCho) {
		return inoShikaCho ? that.INO_SHIKA_CHO_POINTS : 0;
	}
}

module.exports = PointCalc;