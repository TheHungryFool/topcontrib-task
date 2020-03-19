export const ERRORS                  = {
    INVALID_REQUEST : {
        MESSAGE: "Bad request! Failed to validate request",
        CODE   : 5006
    },
    RATE_LIMIT_ERROR: {
        MESSAGE: "Could not proceed further because of rate limiting",
        CODE   : 5005
    },
    NOT_AUTHORIZED  : {
        MESSAGE: "Not authorized to access the resource",
        CODE   : 5001
    },
    NOT_FOUND_ERROR : {
        MESSAGE: "Requested resource was not found",
        CODE   : 5004
    },
    GENERIC_ERROR   : {
        MESSAGE: "Something went wrong! (Internal Error)",
        CODE   : 5000
    }
};
export const CLIENT_TOKEN_KEY        = "X-CLIENT-TOKEN";
export const GITHUB_TOKEN_KEY        = "X-GITHUB-TOKEN";
export const RESPONSE_CODE_ERROR_MAP = {
    5006: ERRORS.INVALID_REQUEST,
    5005: ERRORS.RATE_LIMIT_ERROR,
    5001: ERRORS.NOT_AUTHORIZED,
    5004: ERRORS.NOT_FOUND_ERROR,
    5000: ERRORS.GENERIC_ERROR
};
