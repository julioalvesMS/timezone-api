const codes = require("../constants/codes");
const BusinessError = require("./BusinessError");

class UnauthorizedError extends BusinessError {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
        this.code = codes.UNAUTHORIZED
        this.status = 403;
    }
}

module.exports = UnauthorizedError