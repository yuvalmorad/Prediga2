// load all the things we need
let FacebookStrategy = require('passport-facebook').Strategy;
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// load up the user model
let User = require('../app/models/user');
let Group = require('../app/models/group');
let util = require('../app/utils/util');
// load the auth variables
let configAuth = require('./auth'); // use this one for testing

module.exports = function (passport, configFBPassport, configGooglePassport) {

	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// used to serialize the user for the session
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	// =========================================================================
	// FACEBOOK ================================================================
	// =========================================================================
	let fbStrategy = configAuth[configFBPassport];
	passport.use(new FacebookStrategy(fbStrategy,
		function (req, token, refreshToken, profile, done) {

			// asynchronous
			process.nextTick(function () {

				let email = profile.id + '@google.com';
				if (profile.emails && profile.emails.length > 0) {
					email = (profile.emails[0].value || '').toLowerCase();
				}

				let photo = '';
				if (profile.photos && profile.photos.length > 0 && profile.photos[0].value && profile.photos[0].value.length > 0) {
					photo = profile.photos[0].value;
				}

				// check if the user is already logged in
				if (!req.user) {
					User.findOne({'profileId': profile.id}, function (err, user) {
						if (err)
							return done(err);

						if (user) {

							// if there is a user id already but no token (user was linked at one point and then removed)
							if (!user.token) {
								user.profileId = profile.id;
								user.token = token;
								user.name = profile.name.givenName + ' ' + profile.name.familyName;
								user.email = email;
								user.photo = photo;
								user.save(function (err) {
									if (err)
										return done(err);
									return done(null, user);
								});
							} else {
								// updating
								user.email = email;
								user.photo = photo;
								user.name = profile.name.givenName + ' ' + profile.name.familyName;
								user.save(function (err) {
									if (err)
										return done(err);

									return done(null, user);
								});
							}
						} else {
							// if there is no user, create them
							let newUser = new User();

							newUser.profileId = profile.id;
							newUser.token = token;
							newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
							newUser.email = email;
							newUser.photo = photo;
							newUser.save(function (err, newUser) {
								if (err)
									return done(err);

								// adding the user to the default group
								Group.findOneAndUpdate({_id: util.DEFAULT_GROUP}, {$addToSet: {users: newUser._id}}).then(function () {
									return done(null, newUser);
								});
							});
						}
					});

				} else {
					// user already exists and is logged in, we have to link accounts
					let user = req.user; // pull the user out of the session

					user.profileId = profile.id;
					user.token = token;
					user.name = profile.name.givenName + ' ' + profile.name.familyName;
					user.email = email;
					user.photo = photo;
					user.save(function (err) {
						if (err)
							return done(err);
						return done(null, user);
					});

				}
			});

		}));

	// =========================================================================
	// Google ==================================================================
	// =========================================================================
	let googleStrategy = configAuth[configGooglePassport];
	googleStrategy.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	passport.use(new GoogleStrategy(googleStrategy,
		function (req, token, refreshToken, profile, done) {

			// make the code asynchronous
			// User.findOne won't fire until we have all our data back from Google
			process.nextTick(function () {

				let email = profile.id + '@google.com';
				if (profile.emails && profile.emails.length > 0) {
					email = (profile.emails[0].value || '').toLowerCase();
				}

				let photo = '';
				if (profile.photos && profile.photos.length > 0 && profile.photos[0].value && profile.photos[0].value.length > 0) {
					photo = profile.photos[0].value;
				}

				let name = profile.displayName.length === 0 ? email.substr(0, email.indexOf('@')) : profile.displayName;

				// check if the user is already logged in
				if (!req.user) {
					User.findOne({'profileId': profile.id}, function (err, user) {
						if (err)
							return done(err);

						if (user) {
							// if there is a user id already but no token (user was linked at one point and then removed)
							if (!user.token) {
								user.token = token;
								user.name = name;
								user.email = email;
								user.photo = photo;

								user.save(function (err) {
									if (err)
										return done(err);

									return done(null, user);
								});
							} else {
								user.name = name;
								user.email = email;
								user.photo = photo;

								user.save(function (err) {
									if (err)
										return done(err);

									return done(null, user);
								});
							}
						} else {
							// if there is no user, create them
							let newUser = new User();
							try {
								newUser.profileId = profile.id;
								newUser.token = token;
								newUser.name = name;
								newUser.email = email;
								newUser.photo = photo;
							} catch (err) {
								return done(err);
							}

							newUser.save(function (err, newUser) {
								if (err)
									return done(err);

								// adding the user to the default group
								Group.findOneAndUpdate({_id: util.DEFAULT_GROUP}, {$addToSet: {users: newUser._id}}).then(function () {
									return done(null, newUser);
								});
							});
						}
					});
				} else {
					// user already exists and is logged in, we have to link accounts
					let user = req.user; // pull the user out of the session

					user.profileId = profile.id;
					user.token = token;
					user.name = name;
					user.email = email;
					user.photo = photo;
					user.save(function (err) {
						if (err)
							return done(err);

						// adding the user to the default group
						Group.findOneAndUpdate({_id: util.DEFAULT_GROUP}, {$addToSet: {users: user._id}}).then(function () {
							return done(null, newUser);
						});
					});
				}
			});

		}));
};
