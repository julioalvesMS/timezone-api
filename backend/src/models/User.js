const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const roles = require("../constants/roles");

class User extends Model {
    static init(connection) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            role: {
                type: DataTypes.STRING(3),
                allowNull: false,
                defaultValue: roles.USER,
            },
            lastLoggedIn: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        }, {
            sequelize: connection,
            schema: process.env.DATABASE,
        });
    }

    static associate(models) {
    }

    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = User;
