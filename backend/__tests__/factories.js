const { factory, } = require('factory-girl');
const TimeZone = require('../src/models/TimeZone');
const User = require('../src/models/User');

factory.define('User', User, {
    username: factory.chance('word'),
    password: factory.chance('string'),
})

factory.define('TimeZone', TimeZone, {
    idUser: factory.assoc('User', 'id'),
    name: factory.chance('string'),
    cityName: factory.chance('city'),
    timeDifferenceGMT: factory.chance('floating', { fixed: 1, min: -12, max: 12 }),
})

module.exports = factory;