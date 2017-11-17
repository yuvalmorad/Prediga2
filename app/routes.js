var util = require('./utils/util.js');

module.exports = function (app, passport) {
    /********************************************
     * All routes mapping
     ********************************************* */
    app.use('/api/users', require('./controllers/users.js'));
    app.use('/api/matches', require('./controllers/matches.js'));

    /********************************************
     * Authentications APIs
     ********************************************* */
    app.get('/profile', util.isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            authType: 'rerequest',
            scope: ['email']
        }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    app.get('/connect/facebook',
        passport.authorize('facebook', {
            authType: 'rerequest',
            scope: ['email']
        }));

    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    app.get('/unlink/facebook', util.isLoggedIn, function (req, res) {
        var user = req.user;
        user.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });
};