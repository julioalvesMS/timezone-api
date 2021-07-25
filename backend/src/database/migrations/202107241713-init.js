'use strict';

var Sequelize = require('sequelize');
const logger = require('../../config/logger');
const roles = require('../../constants/roles');


var migrationCommands = function (transaction) {
    return [{
        fn: "createTable",
        params: [
            "users",
            {
                "id": {
                    "type": Sequelize.BIGINT,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "username": {
                    "type": Sequelize.STRING,
                    "field": "username",
                    "allowNull": false
                },
                "password": {
                    "type": Sequelize.STRING,
                    "field": "password",
                    "allowNull": false
                },
                "role": {
                    "type": Sequelize.STRING(5),
                    "field": "role",
                    "allowNull": false,
                    "defaultValue": roles.USER,
                },
                "lastLoggedIn": {
                    "type": Sequelize.DATE,
                    "field": "last_logged_in",
                    "allowNull": true,
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": true
                },
                "createdBy": {
                    "type": Sequelize.BIGINT,
                    "field": "created_by",
                    "allowNull": true,
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": true
                },
                "updatedBy": {
                    "type": Sequelize.BIGINT,
                    "field": "updated_by",
                    "allowNull": true,
                },
                "deletedAt": {
                    "type": Sequelize.DATE,
                    "field": "deleted_at",
                    "allowNull": true
                },
                "deletedBy": {
                    "type": Sequelize.BIGINT,
                    "field": "deleted_by",
                    "allowNull": true,
                },
            },
            {
                "transaction": transaction
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "user_tokens",
            {
                "uuid": {
                    "type": Sequelize.UUID,
                    "field": "uuid",
                    "primaryKey": true,
                    "defaultValue": Sequelize.UUIDV4
                },
                "idUser": {
                    "type": Sequelize.BIGINT,
                    "field": "id_user",
                    "allowNull": false
                },
                "expiryDate": {
                    "type": Sequelize.DATE,
                    "field": "expiry_date",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": true
                },
                "createdBy": {
                    "type": Sequelize.BIGINT,
                    "field": "created_by",
                    "allowNull": true,
                },
            },
            {
                "transaction": transaction
            }
        ]
    },
    {
        fn: "createTable",
        params: [
            "time_zones",
            {
                "id": {
                    "type": Sequelize.BIGINT,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "idUser": {
                    "type": Sequelize.BIGINT,
                    "field": "id_user",
                    "allowNull": false
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name",
                    "allowNull": false
                },
                "cityName": {
                    "type": Sequelize.STRING,
                    "field": "city_name",
                    "allowNull": false
                },
                "timeDifferenceGMT": {
                    "type": Sequelize.DECIMAL(3,1),
                    "field": "time_difference_gmt",
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": true
                },
                "createdBy": {
                    "type": Sequelize.BIGINT,
                    "field": "created_by",
                    "allowNull": true,
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": true
                },
                "updatedBy": {
                    "type": Sequelize.BIGINT,
                    "field": "updated_by",
                    "allowNull": true,
                },
                "deletedAt": {
                    "type": Sequelize.DATE,
                    "field": "deleted_at",
                    "allowNull": true
                },
                "deletedBy": {
                    "type": Sequelize.BIGINT,
                    "field": "deleted_by",
                    "allowNull": true,
                },
            },
            {
                "transaction": transaction
            }
        ]
    },
    ];
};
var rollbackCommands = function (transaction) {
    return [
        {
            fn: "dropTable",
            params: ["user_tokens", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["users", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["time_zones", {
                transaction: transaction
            }]
        },
    ];
};

module.exports = {
    pos: 0,
    useTransaction: true,
    execute: function (queryInterface, Sequelize, _commands) {
        var index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function (resolve, reject) {
                function next() {
                    if (index < commands.length) {
                        let command = commands[index];
                        logger.info(`[#${index}] execute: ${command.fn} ${command.params[0]}`);
                        index++;
                        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                    }
                    else
                        resolve();
                }
                next();
            });
        }
        if (this.useTransaction) {
            return queryInterface.sequelize.transaction(run);
        } else {
            return run(null);
        }
    },
    up: function (queryInterface, Sequelize) {
        return this.execute(queryInterface, Sequelize, migrationCommands);
    },
    down: function (queryInterface, Sequelize) {
        return this.execute(queryInterface, Sequelize, rollbackCommands);
    },
};
