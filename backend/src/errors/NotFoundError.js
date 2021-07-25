const codes = require("../constants/codes");
const BusinessError = require("./BusinessError");

class NotFoundError extends BusinessError {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.code = codes.NOT_FOUND;
        this.status = 404;
    }
}

module.exports = NotFoundError