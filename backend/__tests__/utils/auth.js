const factory = require('../factories');
const { createToken } = require('../../src/auth/token');

async function authenticate(options = {}) {

    let { user } = options;
    if (user === undefined)
        user = await factory.create('User');


    user.token = await createToken(user)
    return user;
}

module.exports = {
    authenticate
}