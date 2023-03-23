const commonValidators = require("./commonValidators");

module.exports = {
    register: {
        username: commonValidators.text,
        password: commonValidators.password,
    },
    getById: {
        id: commonValidators.id,
    },
    update: {
        id: commonValidators.id,
    },
    delete: {
        id: commonValidators.id,
    },
}