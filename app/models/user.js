// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    profileId: String,
    token: String,
    email: String,
    name: String,
    photo: String,
    roles: Array
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.hasRole = function (role) {
    for (var i = 0; i < this.roles.length; i++) {
        if (this.roles[i] === role) {
            return true;
        }
    }
    // if the role does not match return false
    return false;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
