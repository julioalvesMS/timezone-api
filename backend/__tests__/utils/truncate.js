const database = require('../../src/models');

module.exports = async () => {
    return await Promise.all(Object.keys(database.sequelize.models).map(async key => {
        return await database.sequelize.models[key].destroy({ truncate: true, force: true, cascade: true });
    }));
};