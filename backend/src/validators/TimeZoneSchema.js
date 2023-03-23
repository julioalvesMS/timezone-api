const commonValidators = require("./commonValidators");

module.exports = {
    register: {
        name: commonValidators.text,
        cityName: commonValidators.text,
        timeDifferenceGMT: commonValidators.timeDifferenceGMT,
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