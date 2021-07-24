import defaultResponse from "../constants/defaultResponse";


export default {

    async login(req, res) {
        let response = {
            ...defaultResponse,
        };
        try {
            setResponseTimeout(res);
            const { email, password } = req.body;

            let user = null;

            user = await User.login(email, password);

            if (user.employee) {
                const token = await createToken(user.employee, constants.TOKEN_TYPES.EMPLOYEE_LOGIN);
                employee = {
                    ...user.employee.DataValues,
                    token: token
                }
            }

            if (!user)
                throw new AuthenticationError()


            response.status = 200;
            response.message = "Ok";
            response.body = {
                user,
                employee,
                visitor,
            };
            res.status(response.status).send(response);
        }
        catch (err) {
            defaultErrorHandler(err, response, req, res);
        }
    },

}