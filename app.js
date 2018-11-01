require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var pug = require('pug');

var bodyParser = require('body-parser');

//Middleware
const authMiddleware = require('./middlewares/auth.middleware');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

var indexRouter = require('./routes/index.route');
var usersRouter = require('./routes/users.route');
var authRouter = require('./routes/auth.route');
var productsRouter = require('./routes/products.route');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit:'10mb', extended: false }));
app.use(cookieParser('lkahsdfuoqewur381'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', authMiddleware.requireAuth, usersRouter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);

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
