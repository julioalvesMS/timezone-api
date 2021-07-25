const { Model, DataTypes, Sequelize } = require("sequelize");
const contexts = require("../constants/contexts")
const contextService = require('request-context');
const roles = require("../constants/roles");

class TimeZone extends Model {
    static init(connection) {
        super.init({
            idUser: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            cityName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            timeDifferenceGMT: {
                type: DataTypes.DECIMAL(3, 1),
                field: 'time_difference_gmt',
                allowNull: false,
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
            hooks: {
                beforeFind: async (queryObj) => {
                    const user = contextService.get(contexts.user)

                    if (!user)
                        return;

                    switch(user.role) {
                        case roles.USER:
                            queryObj.where = Sequelize.and(queryObj.where, {
                                idUser: user.id
                            })
                    }
                },
            },
        });
    }

    static associate(models) {
    }
}

module.exports = TimeZone;
