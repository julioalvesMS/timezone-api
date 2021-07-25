const codes = require('../constants/codes');
const messages = require('../constants/messages');
const BusinessError = require('./BusinessError');

class AuthenticationError extends BusinessError {
    constructor(errorMessage) {
        if (!errorMessage)
            errorMessage = messages.AUTH.AUTHENTICATION_REJECTED
        super(errorMessage);
        this.name = "AuthenticationError";
        this.code = codes.UNAUTHENTICATED;
        this.status = 403;
    }
}

module.exports = AuthenticationError