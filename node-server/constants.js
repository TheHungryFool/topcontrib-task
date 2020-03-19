module.exports = {
    ERRORS: {
        INVALID_REQUEST : {
            MESSAGE: "Bad request! Failed to validate request",
            CODE   : 5006
        },
        RATE_LIMIT_ERROR: {
            MESSAGE: "Could not proceed further because of rate limiting",
            CODE   : 5005
        },
        NOT_AUTHORIZED  : {
            MESSAGE             : "Not authorized to access the resource",
            MESSAGE_CLIENT_TOKEN: "Not authorized (invalid client token)",
            CODE                : 5001
        },
        NOT_FOUND_ERROR : {
            MESSAGE: "Requested resource was not found",
            CODE   : 5004
        },
        GENERIC_ERROR   : {
            MESSAGE: "Something went wrong! (Internal Error)",
            CODE   : 5000
        },
        INVALID_METHOD   : {
            MESSAGE: "Method not allowed",
            CODE   : 5008
        }
    },
    CLIENT_TOKEN_KEY: "X-CLIENT-TOKEN",
    GITHUB_TOKEN_KEY: "X-GITHUB-TOKEN",
    GITHUB_ERROR: {
        BAD_CREDENTIALS: "Bad credentials",
        NOT_FOUND: "Not Found",
        SEARCH_QUERY_VALIDATION_FAILED: "Validation Failed",
        RATE_LIMIT: "https://developer.github.com/v3/#rate-limiting"
    }
};
