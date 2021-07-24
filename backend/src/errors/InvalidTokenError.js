const BusinessError = require("./BusinessError");
const message = require("../constants/message");

class InvalidTokenError extends BusinessError {
    constructor(errorMessage) {
        if (!errorMessage)
            errorMessage = message.invalidToken;
        super(errorMessage);
        this.name = "InvalidTokenError";
    }
}

module.exports = InvalidTokenError