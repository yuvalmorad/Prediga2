const mongoose = require('mongoose');
const http = require('http');
const util = require('./utils/util.js');
const updateContentFromFiles = require('./utils/updateContentFromFiles');
const automaticUpdater = require('./utils/automaticUpdater');
const migrator = require('./utils/migrator');
const socketIo = require('./utils/socketIo');
const jobRunBeforeDeadlineService = require('./utils/jobRunBeforeDeadlineService');
const updateMatchesAutomatically = require('./utils/updateMatchesAutomatically');
const GroupService = require('./services/groupService');
mongoose.Promise = Promise;

module.exports = function (app, passport) {
	const server = http.Server(app);
	util.init(passport);
	socketIo.init(server);
	updateContentFromFiles.loadAll();
	automaticUpdater.run(true);
	jobRunBeforeDeadlineService.run();
	migrator.run();
	updateMatchesAutomatically.run(true);

	/********************************************
	 * All routes mapping
	 ********************************************* */
	app.use('/api/users', require('./controllers/userController.js'));
	app.use('/api/matches', require('./controllers/matchController.js'));
	app.use('/api/matchesUI', require('./controllers/matchesUIController.js'));
	app.use('/api/userMatchPredictions', require('./controllers/lastPredictionsUIController.js'));
	app.use('/api/teams', require('./controllers/teamController.js'));
	app.use('/api/teamsUI', require('./controllers/teamsUIController.js'));
	app.use('/api/matchPredictions', require('./controllers/matchPredictionController.js'));
	app.use('/api/teamPredictions', require('./controllers/teamPredictionController.js'));
	app.use('/api/groupConfiguration', require('./controllers/groupConfigurationController.js'));
	app.use('/api/group', require('./controllers/groupController.js'));
	app.use('/api/matchResult', require('./controllers/matchResultController.js'));
	app.use('/api/teamResult', require('./controllers/teamResultController.js'));
	app.use('/api/userScore', require('./controllers/userScoreController.js'));
	app.use('/api/usersLeaderboard', require('./controllers/usersLeaderboardController.js'));
	app.use('/api/simulatorUI', require('./controllers/simulatorUIController.js'));
	app.use('/api/leagues', require('./controllers/leagueController.js'));
	app.use('/api/clubs', require('./controllers/clubController.js'));
	app.use('/api/pushSubscription', require('./controllers/pushSubscriptionController.js'));
	app.use('/api/userSettings', require('./controllers/userSettingsController.js'));
	app.use('/api/groupMessages', require('./controllers/groupMessagesController.js'));
	app.use('/api/userStats', require('./controllers/userStatsController.js'));

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
	app.get('/auth/logout', function (req, res) {
		req.logout();
		res.sendStatus(200);
	});

	app.get('/auth/google', function(req,res,next) {
			req.session.isMobile = req.query.isMobile;
			passport.authenticate('google', {
				scope: ['email']
			})(req,res,next);
		}
		, function (req, res) {
			GroupService.autoLogin(req).then(function (path) {
				res.redirect(path);
				delete req.session.returnTo;
			});
		});

	app.get('/auth/google/callback',
		passport.authenticate('google', {
			//successRedirect: '/',
			failureRedirect: '/login'
		}), function (req, res) {
			GroupService.autoLogin(req).then(function (path) {
				if (req.session.isMobile) {
					delete req.session.isMobile;
					//redirect back to native app
					res.redirect('Prediga://login?token=' + req.user.token);
				} else {
					res.redirect(path);
					delete req.session.returnTo;
				}
			});
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
		let user = req.user;
		user.token = undefined;
		user.save(function (err) {
			res.redirect('/');
		});
	});

	app.get('/auth/isLoggedIn', function (req, res) {
		let isLoggedIn = req.isAuthenticated();
		res.status(200).json({isLoggedIn: isLoggedIn});
	});

	return server;
};