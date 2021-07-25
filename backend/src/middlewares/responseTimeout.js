const logger = require('../config/logger');
const messages = require('../constants/messages');
const codes = require('../constants/codes');
const defaultResponse = require('../constants/defaultResponse');

const responseTimeout = (req, res, next) => {
    const timeout = 5000;
    res.setTimeout(timeout, function () {
        let response = { ...defaultResponse };
        
        logger.error({ req, timeout: timeout })
        
        response.code = codes.TIMEOUT;
        response.message = messages.RESPONSE.TIMEOUT;
        res.status(408).send(response)
    });
    next();
}

module.exports = responseTimeout
