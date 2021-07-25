const defaultErrorHandler = require('../utils/defaultErrorHandler');
const codes = require("../constants/codes");
const defaultResponse = require("../constants/defaultResponse");
const User = require('../models/User');
const NotFoundError = require('../errors/NotFoundError');
const DuplicateError = require('../errors/DuplicateError');
const { Op } = require('sequelize');
const UnauthorizedError = require('../errors/UnauthorizedError');
const roles = require('../constants/roles');


module.exports = {
    async getAll(req, res) {
        let response = {
            ...defaultResponse,
        };
        try {
            const records = await User.findAll()

            response.code = codes.SUCESS;
            response.data = records;
            res.send(response);
        }
        catch (err) {
            defaultErrorHandler(err, req, res);
        }
    },
    async getById(req, res) {
        let response = {
            ...defaultResponse,
        };
        try {
            const { userAuth } = req;
            const { id } = req.params;

            const record = await User.findByPk(id)

            if (record === null)
                throw new NotFoundError()

            response.code = codes.SUCESS;
            response.data = record;
            res.send(response);
        }
        catch (err) {
            defaultErrorHandler(err, req, res);
        }
    },

    async register(req, res) {
        let response = {
            ...defaultResponse,
        };
        try {
            const { userAuth } = req;
            const { username, password, role } = req.body;

            if (userAuth.role !== roles.ADMIN)
                throw new UnauthorizedError()

            const duplicateRecords = await User.findAll({
                where: {
                    username: username
                }
            })
            if (duplicateRecords.length > 0)
                throw new DuplicateError()

            await User.create({
                username, password, role,
                createdBy: userAuth.id,
                updatedBy: userAuth.id,
            })

            response.code = codes.SUCESS;
            res.send(response);
        }
        catch (err) {
            defaultErrorHandler(err, req, res);
        }
    },

    async update(req, res) {
        let response = {
            ...defaultResponse,
        };
        try {
            const { userAuth } = req;
            const { username, password, role } = req.body;
            const { id } = req.params;

            const record = await User.findByPk(id);

            if (!record)
                throw new NotFoundError();

            if (role !== undefined && role !== record.role && userAuth.role !== roles.ADMIN)
                throw new UnauthorizedError()

            if (username !== undefined) {
                const duplicateRecords = await User.findAll({
                    where: {
                        username: username,
                    }
                })
                if (duplicateRecords.length > 0)
                    throw new DuplicateError()
            }

            await record.update({
                username, password, role,
                updatedBy: userAuth.id,
            })

            response.code = codes.SUCESS;
            res.send(response);
        }
        catch (err) {
            defaultErrorHandler(err, req, res);
        }
    },

    async delete(req, res) {
        let response = {
            ...defaultResponse,
        };
        try {
            const { id } = req.params;

            const record = await User.findByPk(id);

            if (!record)
                throw new NotFoundError();

            record.destroy();

            response.code = codes.SUCESS;
            res.send(response);
        }
        catch (err) {
            defaultErrorHandler(err, req, res);
        }
    },

}