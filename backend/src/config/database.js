import logger from './logger'

require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

database = {
    dialect: process.env.SQL_DIALECT,
    port: process.env.SQL_PORT,
    host: process.env.SQL_HOST,
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    storage: `./__tests__/${process.env.SQL_STORAGE}.sqlite`,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    logging: (msg) => logger.debug(msg),
    seederStorage: 'sequelize',
    define: {
        timestamps: true,
        underscored: true,
    }
}

export default database;