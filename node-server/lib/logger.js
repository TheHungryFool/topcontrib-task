class Logger {
    static log = (category, message, extra) => {
        if (process.env.NODE_ENV == "test") {
            return;
        }

        let replaceErrors = (key, value) => {
            if (value instanceof Error) {
                let error = {};

                Object.getOwnPropertyNames(value).forEach(function (key) {
                    error[key] = value[key];
                });

                return error;
            }

            return value;
        };

        console.log(JSON.stringify({
            category: category,
            message : message,
            extra   : extra
        }, replaceErrors));
    };

    static info = (message, extra) => {
        Logger.log('info', message, extra);
    };

    static warning = (message, extra) => {
        Logger.log('warning', message, extra);
    };

    static debug = (message, extra) => {
        Logger.log('debug', message, extra);
    };

    static critical = (message, extra) => {
        Logger.log('critical', message, extra);
    };
}


module.exports = Logger;
