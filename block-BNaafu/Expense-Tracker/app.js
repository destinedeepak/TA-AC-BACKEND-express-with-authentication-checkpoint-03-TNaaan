var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo');
var auth = require('./middlewares/auth');
var passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var expenseRouter = require('./routes/expense');
var incomeRouter = require('./routes/income');

require('dotenv').config();

var mongoUrl = 'mongodb://localhost/expenseTrackerDB';
// db connection 
mongoose.connect(mongoUrl,
  {useNewUrlParser: true, useUnifiedTopology:true},
  (error) => console.log(error ? error : "Database connected!"))

require('./modules/passport')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SECRET,
  saveUninitialized:false,
  resave: false,
  store: MongoStore.create({mongoUrl:mongoUrl})
}))

app.use(flash());
app.use(auth.userInfo);
// app.use(passport.initialize());
// app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/expense', expenseRouter);
app.use('/income', incomeRouter);


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
  res.render('error');
});

module.exports = app;
