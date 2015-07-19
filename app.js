var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(methodOverride('_method'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req,res,next){
  if(req.session.user!=undefined){
    //console.log("ha iniciado sesion-"+req.session.user.username);
    if(req.session.lastRequest!=undefined){
      //console.log("ultima peticion"+req.session.lastRequest);
      var newRequest=new Date().getTime();
      if((newRequest-req.session.lastRequest)>=120000){
        delete req.session.user;
        res.redirect(req.session.redir.toString());
      }
    }
    else{
      req.session.lastRequest=new Date().getTime();
      //console.log("no tiene lastRequest"+req.session.lastRequest);
    }
  }
  //console.log("tiempo-"+ new Date().getTime());
  if(!req.path.match(/\/login|\/logout/)){
    //console.log("tiempo2-"+ new Date().getTime());
    req.session.redir= req.path;
  }
  //console.log("tiempo3-"+ new Date().getTime());
  res.locals.session=req.session;
  next();
})

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
            ,errors:[]
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
        ,errors:[]
    });
});


module.exports = app;
