const commonValidators = require("./commonValidators");

module.exports = {
    register: {
        username: commonValidators.text,
        password: commonValidators.password,
        role: commonValidators.role,
    },
    getById: {
        id: commonValidators.id,
    },
    update: {
        id: commonValidators.id,
        username: commonValidators.text,
        password: commonValidators.password,
        role: commonValidators.role,
    },
    delete: {
        id: commonValidators.id,
    },
}