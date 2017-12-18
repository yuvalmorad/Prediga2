// load the things we need
let mongoose = require('mongoose');

// define the schema for our teams model
let teamSchema = mongoose.Schema({
    deadline: Date,
    title: String,
    type: String, // `winner`, `runnerUp`
    league: String,
    options: Array
});

teamSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('Team', teamSchema);