// load the things we need
const mongoose = require('mongoose');

// define the schema for our match predictions model
const matchPredictionSchema = mongoose.Schema({
	groupId: {type: String, default: '5a3eac97d3ca76dbd12bf638'},
	matchId: String,
	userId: String,
	winner: String,
	team1Goals: Number,
	team2Goals: Number,
	goalDiff: Number,
	firstToScore: String,
    modifiedAt: Date
});

matchPredictionSchema.options.toJSON = {
	transform: function (doc, ret, options) {
		delete ret.__v;
		return ret;
	}
};

module.exports = mongoose.model('MatchPrediction', matchPredictionSchema);