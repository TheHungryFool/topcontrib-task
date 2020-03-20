let helper    = require('./helper');
let Log       = require('../lib/logger');
let constants = require('../constants');


class BaseController {
    validateAndProcessRequest = async (request, response) => {
        let result;

        if (!this.isValidRequest(request)) {
            result = helper.getResponseForError(new Error(constants.ERRORS.INVALID_REQUEST.MESSAGE));
        } else {
            try {
                result = await this.process(request);
            } catch (error) {
                Log.critical(String(error));
                result = helper.getResponseForError(error);
            }
        }

        helper.setResponse(result, response);
    };
}


module.exports = BaseController;
