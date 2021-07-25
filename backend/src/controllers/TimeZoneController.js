const defaultErrorHandler = require('../utils/defaultErrorHandler');
const codes = require("../constants/codes");
const defaultResponse = require("../constants/defaultResponse");
const TimeZone = require('../models/TimeZone');
const NotFoundError = require('../errors/NotFoundError');
const { user } = require('../constants/contexts');
const roles = require('../constants/roles');
const UnauthorizedError = require('../errors/UnauthorizedError');


module.exports = {
    async getAll(req, res) {
        let response = {
            ...defaultResponse,
        };
        try {
            const records = await TimeZone.findAll()

            response.code = codes.SUCCESS;
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
            const { id } = req.params;

            const record = await TimeZone.findByPk(id);

            if (record === null)
                throw new NotFoundError()

            response.code = codes.SUCCESS;
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
            const { name, cityName, timeDifferenceGMT, idUser } = req.body;

            if (
                idUser !== undefined &&
                idUser !== userAuth.id &&
                userAuth.role !== roles.ADMIN
            )
                throw new UnauthorizedError();

            const record = await TimeZone.create({
                name, cityName, timeDifferenceGMT,
                idUser: idUser ?? userAuth.id,
            })

            response.code = codes.SUCCESS;
            response.data = record;
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
            const { name, cityName, timeDifferenceGMT } = req.body;
            const { id } = req.params;

            const record = await TimeZone.findByPk(id);

            if (!record)
                throw new NotFoundError();

            await record.update({
                name, cityName, timeDifferenceGMT,
            })

            response.code = codes.SUCCESS;
            response.data = record;
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

            const record = await TimeZone.findByPk(id);

            if (!record)
                throw new NotFoundError();

            record.destroy();

            response.code = codes.SUCCESS;
            res.send(response);
        }
        catch (err) {
            defaultErrorHandler(err, req, res);
        }
    },

}