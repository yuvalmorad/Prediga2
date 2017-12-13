// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// load up the user model
var User = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

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
    var fbStrategy = configAuth[configFBPassport];
    passport.use(new FacebookStrategy(fbStrategy,
        function (req, token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function () {

                // check if the user is already logged in
                if (!req.user) {

                    var email = profile.id + '@google.com';
                    if (profile.emails && profile.emails.length > 0) {
                        email = (profile.emails[0].value || '').toLowerCase();
                    }

                    var photo = '';
                    if (profile.photos && profile.photos.length > 0 && profile.photos[0].value && profile.photos[0].value.length > 0) {
                        photo = profile.photos[0].value;
                    }
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
                            }

                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser = new User();

                            newUser.profileId = profile.id;
                            newUser.token = token;
                            newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
                            newUser.email = email;
                            newUser.photo = photo;
                            newUser.save(function (err) {
                                if (err)
                                    return done(err);
                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.profileId = profile.id;
                    user.token = token;
                    user.name = profile.name.givenName + ' ' + profile.name.familyName;

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
    var googleStrategy = configAuth[configGooglePassport];
    googleStrategy.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    passport.use(new GoogleStrategy(googleStrategy,
        function (req, token, refreshToken, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function () {

                // check if the user is already logged in
                if (!req.user) {
                    var email = profile.id + '@google.com';
                    if (profile.emails && profile.emails.length > 0) {
                        email = (profile.emails[0].value || '').toLowerCase();
                    }

                    var photo = '';
                    if (profile.photos && profile.photos.length > 0 && profile.photos[0].value && profile.photos[0].value.length > 0) {
                        photo = profile.photos[0].value;
                    }

                    User.findOne({'profileId': profile.id}, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.token) {
                                user.token = token;
                                user.name = profile.displayName;
                                user.email = email;
                                user.photo = photo;

                                user.save(function (err) {
                                    if (err)
                                        return done(err);

                                    return done(null, user);
                                });
                            }

                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser = new User();
                            try {
                                newUser.profileId = profile.id;
                                newUser.token = token;
                                newUser.name = profile.displayName;
                                newUser.email = email;
                                newUser.photo = photo;
                            } catch (err) {
                                return done(err);
                            }

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }
                    });
                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.profileId = profile.id;
                    user.token = token;
                    user.name = profile.displayName;
                    user.save(function (err) {
                        if (err)
                            return done(err);

                        return done(null, user);
                    });
                }
            });

        }));
};
