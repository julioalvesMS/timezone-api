
const UnauthorizedError = require("../errors/UnauthorizedError");
const { verifyToken } = require("./token");
const roles = require("../constants/roles");

function checkRole(user, role) {
    
    if (role === roles.ADMIN && user.role !== roles.ADMIN)
        throw new UnauthorizedError()
}

async function checkAuthenticated(req) {
    let response = {
        userAuth: null,
    }

    try {
        const authHeader = req.headers.authorization;
        const jwtToken = authHeader && authHeader.split(' ')[1];
        response.userAuth = await verifyToken(jwtToken);

        return response;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    checkAuthenticated,
}