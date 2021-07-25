const request = require('supertest');

request.Test.prototype.authenticate = function (user) {
    return this
        .set('Authorization', `Bearer ${user.token}`)
}

module.exports = request;