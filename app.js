var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var passportConfig = require('./config/passport')(passport);
var flash = require('express-flash');
var mongoose = require('mongoose');
var hbs = require('hbs');
var helpers = require('./hbshelpers/helpers');
var MongoDBStore = require('connect-mongodb-session')(session);
//use mongodb environment variable
var db_url=process.env.MONGO_URL;

mongoose.Promise = global.Promise;
mongoose.connect(db_url, { useMongoClient: true})
    .then( () => { console.log("Connected to MongoDB"); })
    .catch( (err) => { console.log("Error connecting", err); });

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


// mongodb://armstrong:itrain@ds137826.mlab.com:37826/itrain
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerHelper(helpers);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//stores sessions/cookies in DB
var store = new MongoDBStore( {url : db_url, collection: 'sessions'}, function(err) {
    if (err) {
        console.log('Error, can\'t connect to MongoDB to store session', err);
    }
});

/*stores cookies with unique ids and in conjunction with passport
stores the user connected to that cookie*/
app.use(session({
    secret: 'replace with long random string',
    resave: true,
    saveUninitialized: true,
    store: store
}));

require('./config/passport')(passport);
// passport.js module.export exports a function
// that expects a passport object as an argument.
// This require statement calls that function with the passport
// object you required on line 10.

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
