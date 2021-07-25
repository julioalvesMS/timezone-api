const defaultErrorHandler = require('../utils/defaultErrorHandler');
const codes = require("../constants/codes");
const defaultResponse = require("../constants/defaultResponse");
const TimeZone = require('../models/TimeZone');
const NotFoundError = require('../errors/NotFoundError');


module.exports = {
    async getAll(req, res) {
        let response = {
            ...defaultResponse,
        };
        try {
            const records = await TimeZone.findAll()

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
            const { id } = req.params;

            const record = await TimeZone.findByPk(id);

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
            const { name, cityName, timeDifferenceGMT } = req.body;

            await TimeZone.create({
                name, cityName, timeDifferenceGMT,
                idUser: userAuth.id,
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
            const { name, cityName, timeDifferenceGMT } = req.body;
            const { id } = req.params;

            const record = await TimeZone.findByPk(id);

            if (!record)
                throw new NotFoundError();

            await record.update({
                name, cityName, timeDifferenceGMT,
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

            const record = await TimeZone.findByPk(id);

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