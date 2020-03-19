let express               = require('express');
let path                  = require('path');
let cookieParser          = require('cookie-parser');
let logger                = require('morgan');
let cors                  = require('cors');
let router                = require('./router');
let config                = require('./config');
let constants             = require('./constants');
let NotAuthorizedResponse = require('./views/response').NotAuthorized;
let app                   = express();


process.env.NODE_ENV != "test" && app.use(logger('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// middleware to check if the request is from our client application
// (ideally this should be done in the ingress controller)
app.use((request, response, next) => {
    if (request.get(constants.CLIENT_TOKEN_KEY) != config.clientToken) {
        let result = new NotAuthorizedResponse(constants.ERRORS.NOT_AUTHORIZED.MESSAGE_CLIENT_TOKEN).render();
        response.status(result.http_code).json(result.data);

        // there's no point in proceeding if the request is not from out client app
        return;
    }

    next();
});

app.use('/', router);


module.exports = app;
