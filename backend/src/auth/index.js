
const { verifyToken } = require("./token");

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