let express      = require('express'),
    path         = require('path'),
    cookieParser = require('cookie-parser'),
    logger       = require('morgan'),
    cors         = require('cors'),
    router       = require('./router'),
    app          = express();


app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/', router);


module.exports = app;
