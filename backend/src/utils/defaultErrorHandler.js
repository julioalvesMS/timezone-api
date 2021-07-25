const logger = require('../config/logger');
const BusinessError = require('../errors/BusinessError');
const InvalidTokenError = require('../errors/InvalidTokenError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const AuthenticationError = require('../errors/AuthenticationError');
const defaultResponse = require('../constants/defaultResponse');
const codes = require('../constants/codes');

const defaultErrorHandler = (err, req, res) => {
    let response = {
        ...defaultResponse
    };
    let status;
    if (err instanceof BusinessError) {
        logger.warn(err, err)
        response.code = err.code;
        response.message = err.message;
        status = err.status;
    }
    else {
        logger.error(err, err)
        response.code = codes.UNEXPECTED_ERROR;
        response.message = err.message;
        status = 500;
    }
    res.status(status).send(response);
}

module.exports = defaultErrorHandler;