const { Sequelize, Model, DataTypes } = require("sequelize");

class UserToken extends Model {
    static init(connection) {
        super.init({
            uuid: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            idUser: DataTypes.BIGINT,
            expiryDate: DataTypes.DATE,

            isExpired: {
                type: DataTypes.VIRTUAL,
                get: function () {
                    if (this.expiryDate === null)
                        return false;
                    return this.expiryDate < Date.now();
                }
            },
        }, {
            sequelize: connection,
            paranoid: false,
            updatedAt: false,
        });
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: "idUser", as: "user" });
    }
}

module.exports = UserToken;
