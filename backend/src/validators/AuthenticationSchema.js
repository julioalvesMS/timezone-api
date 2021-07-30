const commonValidators = require("./commonValidators");

module.exports = {
    register: {
        username: commonValidators.text,
        password: commonValidators.password,
    },
    login: {
        username: commonValidators.text,
        password: commonValidators.text,
    },
}