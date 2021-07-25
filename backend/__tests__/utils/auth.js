const factory = require('../factories');
const { createToken } = require('../../src/auth/token');

async function authenticate(options = {}) {

    let { user, role } = options;
    if (user === undefined)
        user = await factory.create('User', {
            role
        });


    user.token = await createToken(user)
    return user;
}

module.exports = {
    authenticate
}