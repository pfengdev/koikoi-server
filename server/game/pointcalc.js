//how to make static class?
let Card = require('../hanafuda/card.js');

var PointCalc = function() {
	var that = this;
	//Minimum number of plain cards to score a point
	var PLAIN_MIN = 10;
	var ANIMAL_MIN = 5;
	var RIBBON_MIN = 5;
	var SPC_RIBBON_MIN = 3;
	var SPC_RIBBON_POINTS = 6;
	var INO_SHIKA_CHO_POINTS = 5;
	//Put these in some kind of shared consts folder?
	var PLAIN = "plain";
	var ANIMAL = "animal";
	var RIBBON = "ribbon";
	var BLUE_RIBBON = "blueRibbon";
	var POETRY_RIBBON = "poetryRibbon";
	var INO_SHIKA_CHO = "inoShikaCho";
	var BRIGHT = "bright";
	var TOTAL = "total";

	var calculate = function(cards) {
		let value = {};
		let cardTypes =  countCardTypes(cards);
		value[PLAIN] = calculatePlains(cardTypes.plain);
		value[ANIMAL] = calculateAnimals(cardTypes.animal);
		value[RIBBON] = calculateRibbons(cardTypes.ribbon);
		value[BLUE_RIBBON] = calculateSpecialRibbons(cardTypes.blueRibbon);
		value[POETRY_RIBBON] = calculateSpecialRibbons(cardTypes.poetryRibbon);
		value[INO_SHIKA_CHO] = calculateInoShikaCho(cardTypes.inoShikaCho);
		value[BRIGHT] = calculateBrights(cardTypes.bright, cardTypes.rainMan);
		value[TOTAL] = 0;
		Object.keys(value).forEach(function(type) {
			if (type !== TOTAL) {
				value[TOTAL] += value[type];
			}
		});
		return value;
	}

	var countCardTypes = function(cards) {
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
			if (card.getCardType() === card.PLAIN) {
				plain++;
			} else if (card.getCardType() === card.POETRY_RIBBON) {
				poetryRibbon++;
			} else if (card.getCardType() === card.BLUE_RIBBON) {
				blueRibbon++;
			} else if (card.getCardType() === card.ANIMAL) {
				animal++;
			} else if (card.getCardType() === card.BRIGHT) {
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
		//how to get around the shorthand notation?
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

	var calculatePlains = function(num) {
		return calculateGeneric(num, that.PLAIN_MIN);
	}

	var calculateAnimals = function(num) {
		return calculateGeneric(num, that.ANIMAL_MIN);
	}

	var calculateGeneric = function(num, min) {
		let points = 0;
		if (num >= min) {
			points = points + num-min + 1;
		}
		return points;
	}

	var calculateRibbons = function(num) {
		return calculateGeneric(num, that.RIBBON_MIN);
	}

	var calculateSpecialRibbons = function(num) {
		if (num === that.SPC_RIBBON_MIN) {
			return that.SPC_RIBBON_POINTS;
		}
		return 0;
	}

	var calculateBrights = function(num, rainMan) {
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

	var calculateInoShikaCho = function(inoShikaCho) {
		return inoShikaCho ? that.INO_SHIKA_CHO_POINTS : 0;
	}

	return {
		calculate : calculate
	}
}

module.exports = PointCalc;