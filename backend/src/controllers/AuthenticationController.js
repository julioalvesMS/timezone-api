const token = require("../auth/token");
const codes = require("../constants/codes");
const defaultResponse = require("../constants/defaultResponse");
const AuthenticationError = require("../errors/AuthenticationError");
const DuplicateError = require("../errors/DuplicateError");
const User = require("../models/User");
const defaultErrorHandler = require("../utils/defaultErrorHandler");


module.exports = {


    async register(req, res) {
        let response = {
            ...defaultResponse,
        };
        try {
            const { username, password } = req.body;

            const duplicateRecords = await User.findAll({
                where: {
                    username: username
                }
            })
            if (duplicateRecords.length > 0)
                throw new DuplicateError()

            const record = await User.create({
                username, password,
            })

            response.code = codes.SUCCESS;
            response.data = record;
            res.send(response);
        }
        catch (err) {
            defaultErrorHandler(err, req, res);
        }
    },

    async login(req, res) {
        let response = {
            ...defaultResponse,
        };
        try {
            const { username, password } = req.body;

            const user = await User.findOne({
                where: {
                    username: username,
                },
                attributes: {
                    include: ['password']
                }
            })

            if (!user)
                throw new AuthenticationError();

            const passwordValid = await user.validPassword(password);
            if (!passwordValid)
                throw new AuthenticationError();

            const jwtToken = await token.createToken(user);

            user.update({
                lastLoggedIn: Date.now()
            })

            response.code = codes.SUCCESS;
            response.data = {
                token: jwtToken
            };
            res.send(response);
        }
        catch (err) {
            defaultErrorHandler(err, req, res);
        }
    },

}