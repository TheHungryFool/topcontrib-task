let constants = require("../constants");


class Response {
    constructor(httpCode, data, error=0) {
        this.httpCode = httpCode;
        this.data     = data;
        this.error    = error
    };

    render = () => ({
        http_code: this.httpCode,
        data     : {
            data : this.data,
            error: this.error
        }
    });
}


class NotFound extends Response {
    constructor() {
        let error = constants.ERRORS.NOT_FOUND_ERROR;
        super(404, {message: error.MESSAGE}, error.CODE);
    }
}


class NotAuthorized extends Response {
    constructor(message) {
        let error = constants.ERRORS.NOT_AUTHORIZED;
        super(401, {message: message || error.MESSAGE}, error.CODE);
    }
}


class ServerError extends Response {
    constructor(data, errorCode) {
        let error = constants.ERRORS.GENERIC_ERROR;
        super(500, data || {message: error.MESSAGE}, errorCode || error.CODE);
    }
}


class ValidationError extends Response {
    constructor() {
        let error = constants.ERRORS.INVALID_REQUEST;
        super(400, {message: error.MESSAGE}, error.CODE);
    }
}

class InvalidMethod extends Response {
    constructor() {
        let error = constants.ERRORS.INVALID_METHOD;
        super(405, {message: error.MESSAGE}, error.CODE);
    }
}

class Success extends Response {
    constructor(data, error=0) {
        super(200, data, error);
    }
}


module.exports = {
    ServerError    : ServerError,
    ValidationError: ValidationError,
    Success        : Success,
    NotFound       : NotFound,
    NotAuthorized  : NotAuthorized,
    InvalidMethod  : InvalidMethod
};
