require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

const app = require('./app.js');
const logger = require('./config/logger');

const PORT = process.env.API_PORT;

var server = require('http').Server(app)
server.timeout = 10000;

server.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});

module.exports = {
    app
};