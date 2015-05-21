"use strict";
var emotionClassifier = function() {

	var previousParameters = [];
	var classifier = {};
	var emotions = [];
	var coefficient_length;
	
	var happyValue = 0;
	var surprisedValue = 0;
	var sadValue = 0;
	var angryValue = 0;

	this.getEmotions = function() {
		return emotions;
	}

	this.clearEmotions = function() {
		happyValue = 0;
		sadValue = 0;
		angryValue = 0;
		surprisedValue = 0;
	}

	this.getHappyValue = function() {
		return happyValue;
	}

	this.getAngryValue = function() {
		return angryValue;
	}

	this.getSurprisedValue = function() {
		return surprisedValue;
	}

	this.getSadValue = function() {
		return sadValue;
	}

	this.init = function(model) {
		// load it
		for (var m in model) {
			emotions.push(m);
			classifier[m] = {};
			classifier[m]['bias'] = model[m]['bias'];
			classifier[m]['coefficients'] = model[m]['coefficients'];
		}
		coefficient_length = classifier[emotions[0]]['coefficients'].length;
	}

	this.getBlank = function() {
		var prediction = [];
		for (var j = 0;j < emotions.length;j++) {
			prediction[j] = {"emotion" : emotions[j], "value" : 0.0};
		}
		return prediction;
	}

	this.predict = function(parameters) {
		var prediction = [];
		for (var j = 0;j < emotions.length;j++) {
			var e = emotions[j];
			var score = classifier[e].bias
			for (var i = 0;i < coefficient_length;i++) {
				score += classifier[e].coefficients[i]*parameters[i+6];
			}
			prediction[j] = {"emotion" : e, "value" : 0.0};
			prediction[j]['value'] = 1.0/(1.0 + Math.exp(-score));
			
			determineEmotionValues(prediction[j]['emotion'], prediction[j]['value']);
		}
		return prediction;
	}

	function determineEmotionValues(emotion, emotionvalue){
		if (emotion == "happy"){
			happyValue += emotionvalue;
		}
		else if (emotion == "surprised"){
			surprisedValue += emotionvalue;
		}
		else if (emotion == "angry"){
			angryValue += emotionvalue;
		}
		else if (emotion == "sad"){
			sadValue += emotionvalue;
		}
		else {
			console.log("error emotionvalue?")
		}

	}







	this.meanPredict = function (parameters) {
		// store to array of 10 previous parameters
		previousParameters.splice(0, previousParameters.length == 10 ? 1 : 0);
		previousParameters.push(parameters.slice(0));
		
		if (previousParameters.length > 9) {
			// calculate mean of parameters?
			var meanParameters = []
			for (var i = 0;i < parameters.length;i++) {
				meanParameters[i] = 0;
			}
			for (var i = 0;i < previousParameters.length;i++) {
				for (var j = 0;j < parameters.length;j++) {
					meanParameters[j] += previousParameters[i][j];
				}
			}
			for (var i = 0;i < parameters.length;i++) {
				meanParameters[i] /= 10;
			}

			// calculate logistic regression 
			return this.predict(meanParameters);
		} else {
			return false;	
		}
	}
}