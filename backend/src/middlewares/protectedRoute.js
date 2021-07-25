const { checkAuthenticated } = require("../auth");
const defaultErrorHandler = require("../utils/defaultErrorHandler");
const contextService = require('request-context');
const contexts = require("../constants/contexts");

module.exports = {
    authenticated: async (req, res, next) => {
        try {
            const { userAuth } = await checkAuthenticated(req)
            req.userAuth = userAuth;
            contextService.set(contexts.user, userAuth);

            next();
        }
        catch (err) {
            defaultErrorHandler(err, req, res);
        }
    },
}