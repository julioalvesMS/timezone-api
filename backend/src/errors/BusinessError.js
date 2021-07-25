const codes = require("../constants/codes");

class BusinessError extends Error {
    constructor(message) {
        super(message);
        this.name = "BusinessError";
        this.code = codes.GENERIC_ERROR;
        this.status = 400;
    }
}

module.exports = BusinessError