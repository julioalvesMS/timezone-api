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
        name: commonValidators.text,
        cityName: commonValidators.text,
        timeDifferenceGMT: commonValidators.timeDifferenceGMT,
    },
    delete: {
        id: commonValidators.id,
    },
}