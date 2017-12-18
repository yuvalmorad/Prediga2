var util = require('./utils/util.js');
var initialData = require('./utils/updateInitialConfiguration');
var automaticUpdater = require('./utils/automaticUpdater');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

module.exports = function (app, passport) {
    initialData.loadAll();
    automaticUpdater.startTask();

    /********************************************
     * All routes mapping
     ********************************************* */
    app.use('/api/users', require('./controllers/users.js'));
    app.use('/api/matches', require('./controllers/matches.js'));
    app.use('/api/matchesUI', require('./controllers/matchesUI.js'));
    app.use('/api/userMatchPredictions', require('./controllers/userMatchPredictions.js'));
    app.use('/api/teams', require('./controllers/teams.js'));
    app.use('/api/teamsUI', require('./controllers/teamsUI.js'));
    app.use('/api/matchPredictions', require('./controllers/matchPredictions.js'));
    app.use('/api/teamPredictions', require('./controllers/teamPredictions.js'));
    app.use('/api/predictionScoreConfiguration', require('./controllers/predictionScoreConfiguration.js'));
    app.use('/api/matchResult', require('./controllers/matchResult.js'));
    app.use('/api/teamResult', require('./controllers/teamResult.js'));
    app.use('/api/userScore', require('./controllers/userScore.js'));
    app.use('/api/usersLeaderboard', require('./controllers/usersLeaderboard.js'));
    app.use('/api/simulatorUI', require('./controllers/simulatorUI.js'));

    /********************************************
     * Automatic Update (Immediate)
     ********************************************* */
    app.get('/api/update', util.isAdmin, function (req, res) {
        automaticUpdater.startAutomaticUpdateJob().then(function () {
            res.sendStatus(200);
        });
    });

    /********************************************
     * Authentications APIs
     ********************************************* */
    app.get('/auth/profile', util.isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    app.get('/auth/logout', function (req, res) {
        req.logout();
        res.sendStatus(200);
    });

    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['email']
        }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

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

    app.get('/auth/connect/facebook',
        passport.authorize('facebook', {
            authType: 'rerequest',
            scope: ['email']
        }));

    app.get('/auth/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    app.get('/auth/unlink/facebook', util.isLoggedIn, function (req, res) {
        var user = req.user;
        user.token = undefined;
        user.save(function (err) {
            res.redirect('/');
        });
    });
};