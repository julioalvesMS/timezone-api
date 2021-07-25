const codes = require("../constants/codes");
const BusinessError = require("./BusinessError");

class DuplicateError extends BusinessError {
    constructor(message) {
        super(message);
        this.name = "DuplicateError";
        this.code = codes.DUPLICATE_RECORD;
        this.status = 400;
    }
}

module.exports = DuplicateError