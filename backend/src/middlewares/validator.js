const { checkAuthenticated } = require("../auth");
const defaultErrorHandler = require("../utils/defaultErrorHandler");
const contextService = require('request-context');
const contexts = require("../constants/contexts");
const { validationResult, checkSchema } = require("express-validator");
const InputValidationError = require("../errors/InputValidationError");

module.exports = {
    validator: function (schema) {
        return async (req, res, next) => {
            try {
                if (!schema || schema === undefined)
                    return next()

                const middlewares = checkSchema(schema)
                
                await Promise.all(middlewares.map(async middleware => (
                    middleware.call(null, req, res, () => null)
                )))

                // Finds the validation errors in this request and wraps them in an object
                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    throw new InputValidationError(errors.array())
                }

                next();
            }
            catch (err) {
                defaultErrorHandler(err, req, res);
            }
        }
    }
}