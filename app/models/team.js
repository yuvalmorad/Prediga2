// load the things we need
var mongoose = require('mongoose');

// define the schema for our teams model
var teamSchema = mongoose.Schema({
    deadline: Date,
    title: String,
    type: String, // `winner`, `runnerUp`
    league: String
});

teamSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('Team', teamSchema);