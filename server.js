// server.js

// set up ======================================================================
// get all the tools we need
let express = require('express');
let app = express();
let port = process.env.PORT || 3000;
let mongoose = require('mongoose');
let passport = require('passport');
let flash = require('connect-flash');
let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let sslRedirect = require('heroku-ssl-redirect');
let GroupService = require('./app/services/groupService');
// configuration ===============================================================
let mongoURI = port !== 3000 ? process.env.MONGOLAB_BRONZE_URI : 'mongodb://localhost:27017/prediga';
console.log('using mongodb url:' + mongoURI);
mongoose
    .connect(mongoURI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

let configGooglePassport = port !== 3000 ? 'googleAuth' : 'googleAuth-local';
require('./config/passport')(passport, configGooglePassport); // pass passport for configuration

// set up our express application
app.use(sslRedirect()); // enable ssl redirect
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
let clientFolder = port === 3000 ? (__dirname + "/public") : (__dirname + "/build");
app.use(express.static(clientFolder));

// required for passport
app.use(session({
    secret: port !== 3000 ? process.env.SESSION_SECRET : 'loginboilerplate',
    resave: false,
    saveUninitialized: true,
    store: require('./app/mongoStore'),
	cookie : { httpOnly: true, maxAge: 2419200000 }
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
let server = require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.get('*', function (req, res) {
	req.session.returnTo = req.url; //set the origin url to redirected back when login
    if (req.isAuthenticated()) {
		GroupService.autoLogin(req).then(function () {
			res.sendFile('index.html', {"root": clientFolder}); // load the single view file (angular will handle the page changes on the front-end)
		});
    } else {
        res.redirect('/auth/google');
    }
});

// launch ======================================================================
server.listen(port);

console.log('The magic happens on port ' + port);