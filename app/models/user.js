// load the things we need
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// define the schema for our user model
const userSchema = mongoose.Schema({
	profileId: String,
	token: String,
	email: String,
	name: String,
	photo: String,
	roles: [String]
});

userSchema.options.toJSON = {
	transform: function (doc, ret, options) {
		delete ret.__v;
		delete ret.roles;
		delete ret.token;
		return ret;
	}
};

// generating a hash
userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.hasRole = function (role) {
	for (let i = 0; i < this.roles.length; i++) {
		if (this.roles[i] === role) {
			return true;
		}
	}
	// if the role does not match return false
	return false;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
