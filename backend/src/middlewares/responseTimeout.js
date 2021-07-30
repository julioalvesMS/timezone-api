require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})
const logger = require('../config/logger');
const messages = require('../constants/messages');
const codes = require('../constants/codes');
const defaultResponse = require('../constants/defaultResponse');

const responseTimeout = (req, res, next) => {
    const timeout = parseInt(process.env.REQUEST_TIMEOUT);
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
