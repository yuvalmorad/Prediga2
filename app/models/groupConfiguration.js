// load the things we need
const mongoose = require('mongoose');

// define the schema for our Prediction Score's Configuration model
const groupConfiguration = mongoose.Schema({
	winner: {type: Number, default: 4},
	team1Goals: {type: Number, default: 2},
	team2Goals: {type: Number, default: 2},
	goalDiff: {type: Number, default: 2},
	firstToScore: {type: Number, default: 2},
	teamInGroup: {type: Number, default: 4},
	teamWinner: {type: Number, default: 20},
	teamRunnerUp: {type: Number, default: 15},
	teamThird: {type: Number, default: 10},
	teamForth: {type: Number, default: 10},
	teamLast: {type: Number, default: 10},
	team2ndLast: {type: Number, default: 10},
	teamGeneral: {type: Number, default: 10},
	minutesBeforeCloseMathPrediction: {type: Number, default: 5}
});

groupConfiguration.options.toJSON = {
	transform: function (doc, ret, options) {
		delete ret.__v;
		return ret;
	}
};

module.exports = mongoose.model('GroupConfiguration', groupConfiguration);