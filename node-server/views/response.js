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
        super(404, {message: 'Requested resource was not found'});
    }
}


class NotAuthorized extends Response {
    constructor() {
        super(401, {message: 'Not authorized to access the resource'});
    }
}


class ServerError extends Response {
    constructor(data, error=5000) {
        super(500, data || {message: 'Something went wrong! (Internal Error)'}, error);
    }
}


class ValidationError extends Response {
    constructor() {
        super(400, {message: 'Bad request! Failed to validate payload'});
    }
}


class Success extends Response {
    constructor(data) {
        super(200, data);
    }
}


module.exports = {
    ServerError    : ServerError,
    ValidationError: ValidationError,
    Success        : Success,
    NotFound       : NotFound,
    NotAuthorized  : NotAuthorized
};
