require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport')
var authenticate = require('./util/authenticate')
var config = require('./util/config')

// routes
var userRouter = require('./routes/user')
var productRouter = require('./routes/product')
var orderRouter = require('./routes/order')

// Image upload
var imageUploadRouter = require('./routes/imageUpload')

var app = express();



app.use(passport.initialize())


mongoose.connect(config.MONGODB_URL,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  // .then(db => console.log(`connected to ${db.connection.name} DB`))
  .catch(err => console.log(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter)
app.use('/imageUpload', imageUploadRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler 
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
