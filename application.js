var CreateErr = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

var IndexRouter = require('./routes/index');
var RecordsRouter = require('./routes/records');

var application = express();

// view engine setup

application.set('views', path.join(__dirname, 'views'));
application.set('view engine', 'pug');

application.use(logger('dev'));
application.use(express.json());
application.use(express.urlencoded({ extended: false }));


application.use('/', IndexRouter);
application.use('/records', RecordsRouter);


application.use(function(req, res, next) {
  //Catching the 404 error and skiping to next error handler
  next(CreateErr(404));
});

// error handler
application.use(function(err, req, res, next) {
  //Locale settings, providing errors only during development
  res.locals.message = err.message;
  res.locals.error = req.application.get('env') === 'development' ? err : {};

  
  res.status(err.status || 500);
  res.render('error');
});

console.log(`Server is on port: ${process.env.PORT}`)
module.exports = application;