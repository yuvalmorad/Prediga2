var util = require('./utils/util.js');

module.exports = function (app, passport) {
    // update initial data
    var initialData = require('../app/utils/updateInitialConfiguration');
    initialData.loadAll();
    /********************************************
     * All routes mapping
     ********************************************* */
    app.use('/api/users', require('./controllers/users.js'));
    app.use('/api/matches', require('./controllers/matches.js'));
    app.use('/api/matchesUI', require('./controllers/matchesUI.js'));
    app.use('/api/teams', require('./controllers/teams.js'));
    app.use('/api/matchPredictions', require('./controllers/matchPredictions.js'));
    app.use('/api/teamPredictions', require('./controllers/teamPredictions.js'));
    app.use('/api/predictionScoreConfiguration', require('./controllers/predictionScoreConfiguration.js'));
    app.use('/api/matchResult', require('./controllers/matchResult.js'));
    app.use('/api/teamResult', require('./controllers/teamResult.js'));
    app.use('/api/userScore', require('./controllers/userScore.js'));
    app.use('/api/usersLeaderboard', require('./controllers/usersLeaderboard.js'));

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
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    app.get('/connect/facebook',
        passport.authorize('facebook', {
            authType: 'rerequest',
            scope: ['email']
        }));

    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    app.get('/unlink/facebook', util.isLoggedIn, function (req, res) {
        var user = req.user;
        user.token = undefined;
        user.save(function (err) {
            res.redirect('/');
        });
    });
};