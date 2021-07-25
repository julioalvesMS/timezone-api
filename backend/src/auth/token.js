require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})
const UserToken = require("../models/UserToken");
const { addDays } = require("../utils/dateOperations");
const jwt = require('jsonwebtoken');
const InvalidTokenError = require("../errors/InvalidTokenError");
const AuthenticationError = require('../errors/AuthenticationError');


module.exports = {
    async createToken(user) {
        const tokens = await UserToken.findAll({
            where: {
                idUser: user.id,
            }
        })
        tokens.forEach((token) => {
            if (token.isExpired)
                token.destroy();
        })

        const expiryDate = addDays(Date.now(), 1);

        const token = await UserToken.create({
            idUser: user.id,
            expiryDate: expiryDate,
        })

        return jwt.sign({ user: token.idUser, uuid: token.uuid }, process.env.SECRET_KEY);
    },

    async verifyToken(token) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        }
        catch (err) {
            throw new InvalidTokenError();
        }

        const userToken = await UserToken.findOne({
            where: {
                uuid: decoded.uuid,
            },
            include: [{
                association: 'user',
            }]
        });

        if (!userToken)
            throw new AuthenticationError();

        if (userToken.isExpired) {
            userToken.destroy();
            throw new AuthenticationError();
        }

        return userToken.user;
    },
}