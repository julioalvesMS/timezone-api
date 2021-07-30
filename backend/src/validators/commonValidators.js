const roles = require("../constants/roles");

module.exports = {
    id: {
        in: ['params'],
        isInt: true,
        toInt: true,
    },
    text: {
        exists: {
            errorMessage: 'Missing required field',
        },
    },
    password: {
        in: ['body'],
        isLength: {
            errorMessage: 'Password should be at least 7 chars long',
            options: { min: 7 },
        },
        exists: {
            errorMessage: 'Password is required',
        },
    },
    role: {
        isIn: {
            options: [roles.ADMIN, roles.USER],
            errorMessage: `Valid role options are: ${[roles.ADMIN, roles.USER].join(',')}`,
        }
    },
    timeDifferenceGMT: {
        exists: {
            errorMessage: 'Time Zone difference to GMT is required',
        },
        isFloat: {
            errorMessage: 'This Time Zone value is not valid',
            options: {min: -12, max: 12}
        },
    }
}