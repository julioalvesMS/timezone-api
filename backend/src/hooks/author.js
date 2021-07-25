const contexts = require("../constants/contexts")
const contextService = require('request-context');

module.exports = {
    onCreate: async (modelObject, options) => {
        const user = contextService.get(contexts.user)
        modelObject.createdBy = user?.id;
        modelObject.updatedBy = user?.id;
    },
    onUpdate: async (modelObject, options) => {
        const user = contextService.get(contexts.user)
        modelObject.createdBy = user?.id;
    },
    onDestroy: async (modelObject, options) => {
        const user = contextService.get(contexts.user)
        modelObject.createdBy = user?.id;
    },
}