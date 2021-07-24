const message = require('../constants/message');
const BusinessError = require('./BusinessError');

class AuthenticationError extends BusinessError {
    constructor(errorMessage) {
        if (!errorMessage)
            errorMessage = message.authenticationFailed
        super(errorMessage);
        this.name = "AuthenticationError";
    }
}

module.exports = AuthenticationError