const { Model, DataTypes } = require("sequelize");

class TimeZone extends Model {
    static init(connection) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            cityName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            timeDifferenceGMT: {
                type: DataTypes.DECIMAL(2, 1),
                allowNull: false,
            },
        }, {
            sequelize: connection,
            schema: process.env.DATABASE,
        });
    }

    static associate(models) {
    }
}

module.exports = TimeZone;
