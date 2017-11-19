// load the things we need
var mongoose = require('mongoose');

// define the schema for our team predictions model
var teamPredictionSchema = mongoose.Schema({
    teamId: String,
    userId: String,
    team: String
});

teamPredictionSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('TeamPrediction', teamPredictionSchema);