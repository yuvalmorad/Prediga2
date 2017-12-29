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

// configuration ===============================================================
let configDB = port !== 3000 ? process.env.MONGODB_URI : 'mongodb://localhost:27017/prediga';
let clientFolder = port === 3000 ? (__dirname + "/public") : (__dirname + "/build");

mongoose.connect(configDB, function (err) {
    if (err) console.log('Unable to connect to DB ' + err);
    else console.log('Connection to DB successful')
}); // connect to our database
let configFBPassport = port !== 3000 ? 'facebookAuth' : 'facebookAuth-local';
let configGooglePassport = port !== 3000 ? 'googleAuth' : 'googleAuth-local';
require('./config/passport')(passport, configFBPassport, configGooglePassport); // pass passport for configuration

// set up our express application
app.use(sslRedirect()); // enable ssl redirect
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
let server = require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.get('*', function (req, res) {
    if (req.isAuthenticated()) {
        res.sendFile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
    } else {
        res.redirect('/auth/google');
    }
});

// launch ======================================================================
server.listen(port);

console.log('The magic happens on port ' + port);
