// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// configuration ===============================================================
var configDB = port !== 3000 ? process.env.MONGODB_URI : 'mongodb://localhost:27017/prediga';
var clientFolder = port === 3000 ? (__dirname + "/public") : (__dirname + "/build");

mongoose.connect(configDB, function (err) {
    if (err) console.log('Unable to connect to DB ' + err);
    else console.log('Connection to DB successful')
}); // connect to our database
var configFBPassport = port !== 3000 ? 'facebookAuth' : 'facebookAuth-local';
var configGooglePassport = port !== 3000 ? 'googleAuth' : 'googleAuth-local';
require('./config/passport')(passport, configFBPassport, configGooglePassport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(clientFolder));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'predigaloginboilerplate', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.get('*', function (req, res) {
    res.redirect('/auth/google');
    //res.sendFile(clientFolder + '/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
