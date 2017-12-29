// load the things we need
const mongoose = require('mongoose');

// define the schema for our team predictions model
const teamPredictionSchema = mongoose.Schema({
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