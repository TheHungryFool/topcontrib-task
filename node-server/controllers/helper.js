let responses = require('../views/response');
let constants = require('../constants');


module.exports = {
    getResponseForError: (error) => {
        if (error.message == constants.ERRORS.NOT_AUTHORIZED.MESSAGE) {
            return new responses.NotAuthorized().render();
        } else if (error.message == constants.ERRORS.NOT_FOUND_ERROR.MESSAGE) {
            return new responses.NotFound().render();
        } else if (error.message == constants.ERRORS.INVALID_REQUEST.MESSAGE) {
            return new responses.ValidationError().render();
        } else {
            return new responses.ServerError().render();
        }
    },
    isString           : (obj) => {
        return (Object.prototype.toString.call(obj) === '[object String]');
    },
    setResponse        : (result, response) => {
        response.status(result.http_code).json(result.data);
    }
};
