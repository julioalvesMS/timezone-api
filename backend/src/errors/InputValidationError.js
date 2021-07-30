const codes = require("../constants/codes");
const BusinessError = require("./BusinessError");

class InputValidationError extends BusinessError {
    constructor(errors) {
        super(codes.INVALID_INPUT);
        this.name = "InputValidationError";
        this.code = codes.INVALID_INPUT;
        this.status = 400;
        this.data = errors;
    }
}

module.exports = InputValidationError