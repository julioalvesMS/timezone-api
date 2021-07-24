const fs = require('fs');
const path = require('path');

const Sequelize = require("sequelize");


const database = {
    config: require("../config/database"),
    path: path.resolve(__dirname, '..', 'models'),
    models: {},
    sequelize: undefined
};

const db_sequelize = new Sequelize(database.config);
db_sequelize.dialect.supports.schemas = true;
database.sequelize = db_sequelize;

fs
    .readdirSync(database.path)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== database.path) && (file !== 'index.js') && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const modelClass = require(path.join(database.path, file));
        modelClass.init(db_sequelize)
        const model = db_sequelize.models[modelClass.name];
        database.models[model.name] = model;
    });


for (let modelName in database.models) {
    const model = database.models[modelName];
    model.associate(databases.integra.models);
}


module.exports = databases;
