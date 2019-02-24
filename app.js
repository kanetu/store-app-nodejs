require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var pug = require('pug');
// var passport = require('passport');
var bodyParser = require('body-parser');
// var flash = require('connect-flash');
//Middleware
const authMiddleware = require('./middlewares/auth.middleware');
const sessionMiddleware = require('./middlewares/session.middleware');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

var indexRouter = require('./routes/index.route');
var adminRouter = require('./routes/admin.route');
var authRouter = require('./routes/auth.route');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit:'10mb', extended: false }));
app.use(cookieParser('lkahsdfuoqewur381'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  maxAge: new Date(Date.now() + (30 * 86400 * 1000)),
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', sessionMiddleware.initCart, indexRouter);
app.use('/auth', authRouter);
app.use('/admin',
      authMiddleware
      .requireAuthv2,
      adminRouter);

app.use('/confirm-user/:token', authMiddleware.confirmUser);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error/error');
});

module.exports = app;
