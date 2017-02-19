var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var device = require('express-device');

var MobileDetect = require('mobile-detect');
var useragent = require('useragent');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Using device capturing to add req.device object
// with details about the device using req's useragent string
// possible values: desktop, tv, tablet, phone, bot or car
app.use(device.capture());
device.enableDeviceHelpers(app);

// Disable etag headers on responses - eTag(entity Tag) is a header which caches on browser
app.disable('etag');

app.use(express.static(path.join(__dirname, 'public')));

// Top level middlewares for core routes

// Appending mobile info based on user agent
// checking login authentication is valid or not
// 
var appendMobileDetection = function (req, res, next) {

  var agent = useragent.parse(req.headers['user-agent']);
  var ua = useragent.is(req.headers['user-agent'])

  // console.log('***This should be the agent', agent, ua);
  
  req.configJson = {};
  var md = new MobileDetect(req.headers['user-agent']);
  req.configJson.locals = res.locals; // holds the device information received from express-device module
  req.configJson.locals.device_name = md.mobile();
  req.configJson.locals.os = md.os();
  req.configJson.locals.browser = {
    agent: agent,
    ua: ua
  };
  // if(req.cookies && req.cookies.device && req.cookies.device == 'app'){
  //   req.configJson.locals.webview = true;
  // } 
  // else {
  //   req.configJson.locals.webview = false;
  // }
  next();

};
app.use(appendMobileDetection);


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
