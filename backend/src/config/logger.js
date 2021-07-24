const { createLogger, transports, format } = require('winston');
const { combine, timestamp, json } = format;

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        json(),
    ),
    defaultMeta: { service: 'timezone-api' },
    exitOnError: false,
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new transports.File({
            filename: 'error.log',
            level: 'error',
            handleExceptions: true
        }),
        new transports.File({
            filename: 'combined.log',
            handleExceptions: true
        }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple(),
        // level: 'debug',
    }));
}
if (process.env.NODE_ENV === 'test') {
    logger.level = 'error'
}

module.exports = logger;