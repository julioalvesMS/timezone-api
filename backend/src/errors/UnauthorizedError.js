const BusinessError = require("./BusinessError");

class UnauthorizedError extends BusinessError {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
    }
}

module.exports = UnauthorizedError