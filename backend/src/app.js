require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

const express = require('express');

class App {
    constructor() {
        this.express = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(express.json({ limit: '50mb' }));

        var cors = require('cors');
        this.express.use(cors());

        // const contextService = require('request-context');
        // this.express.use(contextService.middleware('request'));

        this.express.use(express.urlencoded({ extended: true }));
    }

    routes() {
        this.express.use(require('./routes'));
    }
}

const app = new App().express;

module.exports = app;