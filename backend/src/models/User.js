const { Model, DataTypes, Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const roles = require("../constants/roles");
const contexts = require("../constants/contexts")
const contextService = require('request-context');

class User extends Model {
    static init(connection) {
        super.init({
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            role: {
                type: DataTypes.STRING(5),
                allowNull: false,
                defaultValue: roles.USER,
            },
            lastLoggedIn: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            createdBy: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            updatedBy: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            deletedBy: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
        }, {
            sequelize: connection,
            paranoid: true,
            defaultScope: {
                attributes: {
                    exclude: ['password']
                }
            },
            hooks: {
                beforeCreate: async (modelObject, options) => {
                    const hash = await this.hashPassword(modelObject.password)
                    modelObject.password = hash;
                },
                beforeUpdate: async (modelObject, options) => {
                    if (modelObject.password === undefined)
                        return;

                    const hash = await this.hashPassword(modelObject.password)
                    modelObject.password = hash;
                },
                beforeFind: async (queryObj) => {
                    const user = contextService.get(contexts.user)

                    if (!user)
                        return;

                    switch(user.role) {
                        case roles.USER:
                            queryObj.where = Sequelize.and(queryObj.where, {
                                id: user.id
                            })
                    }
                },
            },
        });
    }

    static associate(models) {
    }

    static async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    async validPassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}

module.exports = User;
