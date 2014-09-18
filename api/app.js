var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var db = require('./lib/db');
var routes = require('./routes/routes');

var app = express();

if (app.get('env') === 'development') {
    app.use(logger('dev'));
} else {
    app.use(logger('short'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    // middleware to prevent Safari bug showing blank page on 304 HTTP response
    agent = req.headers['user-agent'];
    if ((agent.indexOf('Safari') > -1) && (agent.indexOf('Chrome') === -1) && (agent.indexOf('OPR') === -1)) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
    }
    next();
});

db.open(function() {
    app.use('/', routes);

    /// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /// error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.json(500, err);
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json(500, 'something went wrong');
    });
});

module.exports = app;
