const UserToken = require("../models/integra/UserToken");
const { addDays, addSeconds } = require("./dateOperations");
const jwt = require('jsonwebtoken');
const { TOKEN_TYPES } = require("../constants");
const InvalidTokenError = require("../errors/InvalidTokenError");
const constants = require("../constants");
const logger = require("../config/logger");


module.exports = {
    async createToken(user, type) {
        const tokens = await UserToken.findAll({
            where: {
                idUser: user.id,
            }
        })
        tokens.forEach((token) => {
            if (token.isExpired)
                token.destroy();
        })

        let expiryDate;
        switch (type) {
            case TOKEN_TYPES.PRESIGN:
                expiryDate = addSeconds(Date.now(), 300);
                break;
            case TOKEN_TYPES.USER_LOGIN:
            case TOKEN_TYPES.EMPLOYEE_LOGIN:
            case TOKEN_TYPES.VISITOR_LOGIN:
            case TOKEN_TYPES.USER_PASSWORD:
            case TOKEN_TYPES.EMPLOYEE_PASSWORD:
            case TOKEN_TYPES.VISITOR_PASSWORD:
                expiryDate = addDays(Date.now(), 1);
                break;
            default:
                expiryDate = null;
                break;
        }

        const token = await UserToken.create({
            idUser: user.id,
            expiryDate: expiryDate,
            type: type
        })

        return jwt.sign({ user: token.idUser, uuid: token.uuid, type: token.type }, process.env.SECRET_KEY);
    },

    async verifyToken(token, type) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        }
        catch (err) {
            throw new InvalidTokenError();
        }

        let tokenType = type;
        if (type === undefined)
            tokenType = decoded.type;

        let include;
        switch (tokenType) {
            case TOKEN_TYPES.EMPLOYEE_LOGIN:
            case TOKEN_TYPES.EMPLOYEE_PASSWORD:
            case TOKEN_TYPES.EMPLOYEE_REGISTRATION:
                include = [{
                    association: 'employee',
                    where: { excluido: constants.NAO },
                }];
                break;
            case TOKEN_TYPES.VISITOR_LOGIN:
            case TOKEN_TYPES.VISITOR_PASSWORD:
            case TOKEN_TYPES.VISITOR_REGISTRATION:
                include = [{
                    association: 'visitor',
                    where: { deleted: false },
                }];
                break;
            case TOKEN_TYPES.USER_LOGIN:
            case TOKEN_TYPES.USER_PASSWORD:
            case TOKEN_TYPES.USER_REGISTRATION:
            case TOKEN_TYPES.PRESIGN:
            default:
                include = [{
                    association: 'user',
                    where: { excluido: constants.NAO },
                }];
                break;
        }

        const userToken = await UserToken.findOne({
            where: {
                uuid: decoded.uuid,
                type: tokenType,
            },
            include: include
        });

        if (!userToken)
            throw new InvalidTokenError();

        if (userToken.isExpired) {
            userToken.destroy();
            throw new InvalidTokenError();
        }

        return userToken[include[0].association];
    },

    async deleteTokenType(req) {
        const token = req.headers.authorization;
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        }
        catch (err) {
            logger.warn('Unable to decrypt token for deletion')
            return;
        }

        await UserToken.destroy({
            where: {
                idUser: decoded.user,
                type: decoded.type,
            },
        });
    },
}