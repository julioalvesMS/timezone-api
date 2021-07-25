const BusinessError = require("./BusinessError");
const message = require("../constants/messages");
const codes = require("../constants/codes");

class InvalidTokenError extends BusinessError {
    constructor(errorMessage) {
        if (!errorMessage)
            errorMessage = message.invalidToken;
        super(errorMessage);
        this.name = "InvalidTokenError";
        this.code = codes.INVALID_TOKEN;
        this.status = 401;
    }
}

module.exports = InvalidTokenError